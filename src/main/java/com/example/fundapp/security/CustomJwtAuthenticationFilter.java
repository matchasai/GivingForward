package com.example.fundapp.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.fundapp.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomJwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(CustomJwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        if (log.isDebugEnabled())
            log.debug("JWT Filter ENTRY - {} {}", method, requestURI);

        // Skip JWT processing for most public endpoints
        if (isPublicEndpoint(requestURI)) {
            chain.doFilter(request, response);
            return;
        }

        try {
            String jwt = getJwtFromRequest(request);
            if (log.isDebugEnabled()) {
                log.debug("JWT Filter - Request URI: {}", requestURI);
                log.debug("JWT Filter - JWT token found: {}", (jwt != null ? "Yes" : "No"));
            }

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJWT(jwt);
                if (log.isDebugEnabled())
                    log.debug("JWT Filter - Valid token for user: {}", username);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                if (log.isDebugEnabled())
                    log.debug("JWT Filter - Authentication set for user: {}", username);
            } else if (StringUtils.hasText(jwt)) {
                // Token was provided but is invalid/expired -> signal client to refresh
                if (log.isDebugEnabled())
                    log.debug("JWT Filter - Invalid/expired JWT provided; returning 401");
                response.setStatus(401);
                response.setHeader("X-Error-Reason", "invalid-token");
                response.setHeader("WWW-Authenticate", "Bearer error=invalid_token");
                return;
            } else {
                if (log.isDebugEnabled())
                    log.debug("JWT Filter - No JWT token provided");
            }
        } catch (Exception e) {
            if (log.isDebugEnabled())
                log.debug("JWT Filter - Exception: {}: {}", e.getClass().getSimpleName(), e.getMessage());
            // Intentionally minimal: on failure, continue without authentication
        }

        chain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String requestURI) {
        return requestURI.startsWith("/api/auth/") ||
                requestURI.startsWith("/api/public/") ||
                requestURI.startsWith("/api/test/") ||
                requestURI.equals("/api/campaigns/active") ||
                requestURI.startsWith("/uploads/");
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            return token != null ? token.trim() : null;
        }
        return null;
    }
}