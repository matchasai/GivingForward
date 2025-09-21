package com.givingforward.auth.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.givingforward.auth.dto.AuthResponse;
import com.givingforward.auth.dto.LoginRequest;
import com.givingforward.auth.dto.RegisterRequest;
import com.givingforward.auth.model.RefreshToken;
import com.givingforward.auth.model.User;
import com.givingforward.auth.repository.RefreshTokenRepository;
import com.givingforward.auth.repository.UserRepository;
import com.givingforward.auth.security.JwtTokenProvider;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            User user = (User) authentication.getPrincipal();
            RefreshToken rt = createRefreshToken(user);
            return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole().name())
                    .withRefresh(rt.getToken(), rt.getExpiresAt());
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(User.Role.USER);
        User savedUser = userRepository.save(user);
        String jwt = tokenProvider.generateToken(savedUser);
        RefreshToken rt = createRefreshToken(savedUser);
        return new AuthResponse(jwt, savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                savedUser.getRole().name()).withRefresh(rt.getToken(), rt.getExpiresAt());
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(UUID.randomUUID().toString());
        long refreshTtlMs = tokenProvider.getRefreshExpirationMs();
        rt.setExpiresAt(Instant.now().plusMillis(refreshTtlMs));
        return refreshTokenRepository.save(rt);
    }

    public AuthResponse refresh(String refreshToken) {
        RefreshToken rt = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));
        if (rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired or revoked");
        }
        User user = rt.getUser();
        String jwt = tokenProvider.generateToken(user);
        // rotate refresh token
        rt.setRevoked(true);
        refreshTokenRepository.save(rt);
        RefreshToken newRt = createRefreshToken(user);
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole().name())
                .withRefresh(newRt.getToken(), newRt.getExpiresAt());
    }

    public void logout(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}