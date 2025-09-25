package com.example.fundapp.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fundapp.dto.DonationRequest;
import com.example.fundapp.model.Donation;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.UserRepository;
import com.example.fundapp.security.JwtTokenProvider;
import com.example.fundapp.service.CustomUserDetailsService;
import com.example.fundapp.service.DonationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final DonationService donationService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Value("${razorpay.keyId:}")
    private String razorpayKeyId;

    @Value("${razorpay.keySecret:}")
    private String razorpayKeySecret;

    public PaymentController(DonationService donationService) {
        this.donationService = donationService;
    }

    public static class CreateOrderRequest {
        public String campaignId;
        public BigDecimal amount; // in rupees

        public String getCampaignId() {
            return campaignId;
        }

        public BigDecimal getAmount() {
            return amount;
        }
    }

    public static class VerifyRequest {
        public String campaignId;
        public BigDecimal amount; // in rupees
        public String razorpayOrderId;
        public String razorpayPaymentId;
        public String razorpaySignature;

        public String getCampaignId() {
            return campaignId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public String getRazorpayOrderId() {
            return razorpayOrderId;
        }

        public String getRazorpayPaymentId() {
            return razorpayPaymentId;
        }

        public String getRazorpaySignature() {
            return razorpaySignature;
        }
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest body) throws Exception {
        // Safe diagnostic: do NOT print key values
        if (log.isDebugEnabled()) {
            log.debug("Razorpay config present? keyId={}, keySecret={}",
                    (razorpayKeyId != null && !razorpayKeyId.isBlank()),
                    (razorpayKeySecret != null && !razorpayKeySecret.isBlank()));
        }
        if (razorpayKeyId == null || razorpayKeyId.isBlank() || razorpayKeySecret == null
                || razorpayKeySecret.isBlank()) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Razorpay keys not configured on server",
                    "hint", "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend environment and restart"));
        }
        if (body == null || body.campaignId == null || body.amount == null
                || body.amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid campaign or amount"));
        }

        // Razorpay requires minimum amount of 100 paise (INR 1.00)
        if (body.amount.compareTo(new BigDecimal("1.00")) < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Minimum donation amount is INR 1.00"));
        }

        long amountPaise;
        try {
            amountPaise = body.amount.movePointRight(2).setScale(0, RoundingMode.HALF_UP).longValue();
        } catch (ArithmeticException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid amount precision"));
        }

        Map<String, Object> orderPayload = new HashMap<>();
        orderPayload.put("amount", amountPaise);
        orderPayload.put("currency", "INR");
        orderPayload.put("receipt", "rcpt_" + body.campaignId + "_" + System.currentTimeMillis());

        String json = objectMapper.writeValueAsString(orderPayload);

        String auth = razorpayKeyId + ":" + razorpayKeySecret;
        String basicAuth = "Basic " + Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.razorpay.com/v1/orders"))
                .timeout(Duration.ofSeconds(20))
                .header("Authorization", basicAuth)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        try {
            HttpResponse<String> resp = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() >= 200 && resp.statusCode() < 300) {
                JsonNode node = objectMapper.readTree(resp.body());
                Map<String, Object> result = new HashMap<>();
                result.put("orderId", node.get("id").asText());
                result.put("amount", node.get("amount").asLong()); // paise
                result.put("currency", node.get("currency").asText());
                result.put("key", razorpayKeyId); // public key to use on client
                return ResponseEntity.ok(result);
            } else {
                // Log diagnostic details
                log.warn("Razorpay order create failed: status={}, bodyLength={}", resp.statusCode(),
                        (resp.body() != null ? resp.body().length() : 0));
                // Return structured error for the client toast
                Map<String, Object> err = new HashMap<>();
                err.put("message", "Razorpay order creation failed");
                err.put("details", resp.body());
                return ResponseEntity.status(resp.statusCode()).body(err);
            }
        } catch (Exception ex) {
            log.warn("Razorpay order create exception: {}: {}", ex.getClass().getSimpleName(), ex.getMessage());
            Map<String, Object> err = new HashMap<>();
            err.put("message", "Unable to reach Razorpay API");
            err.put("details", ex.getMessage());
            return ResponseEntity.status(502).body(err);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyRequest body,
            @RequestHeader(value = "Authorization", required = false) String authorization) throws Exception {
        if (razorpayKeySecret == null || razorpayKeySecret.isBlank()) {
            return ResponseEntity.status(500).body(Map.of("message", "Razorpay secret not configured on server"));
        }
        if (body == null || body.campaignId == null || body.amount == null ||
                body.razorpayOrderId == null || body.razorpayPaymentId == null || body.razorpaySignature == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification payload"));
        }

        // Best-effort: if a valid Bearer token is present, authenticate this thread's
        // context
        User authedUser = null;
        try {
            if (authorization != null && authorization.startsWith("Bearer ")) {
                if (log.isDebugEnabled())
                    log.debug("[verify] Authorization header present");
                String jwt = authorization.substring(7).trim();
                String username = tokenProvider.getUsernameFromJWT(jwt);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                authedUser = userRepository.findByEmail(username).orElse(null);
                if (log.isDebugEnabled())
                    log.debug("[verify] Token valid for user={}, entityFound={} ", username, (authedUser != null));
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ignored) {
            if (log.isDebugEnabled())
                log.debug("[verify] Authorization processing error: {}", ignored.getMessage());
        }

        String payload = body.razorpayOrderId + "|" + body.razorpayPaymentId;
        String expectedSignature = hmacSha256Hex(payload, razorpayKeySecret);

        if (!expectedSignature.equals(body.razorpaySignature)) {
            return ResponseEntity.status(400).body(Map.of("message", "Signature mismatch"));
        }

        // Payment verified, record donation
        DonationRequest donationRequest = new DonationRequest();
        donationRequest.setCampaignId(body.campaignId);
        donationRequest.setAmount(body.amount);
        Donation donation;
        if (authedUser != null) {
            // Persist for the authenticated user explicitly
            donation = donationService.makeDonationForUser(authedUser, donationRequest);
        } else {
            if (log.isDebugEnabled())
                log.debug("[verify] Proceeding as anonymous donation");
            // Anonymous donation
            donation = donationService.makeDonation(donationRequest);
        }

        return ResponseEntity.ok(donation);
    }

    private static String hmacSha256Hex(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(raw.length * 2);
        for (byte b : raw) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
