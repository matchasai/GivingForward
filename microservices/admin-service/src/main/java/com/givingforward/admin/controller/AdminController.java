package com.givingforward.admin.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
        @Autowired
        private RestTemplate restTemplate;

        @GetMapping("/stats")
        public ResponseEntity<Map<String, Object>> getStats() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                                authentication.getAuthorities().stream()
                                                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
                Map<String, Object> stats = new HashMap<>();
                Long totalUsersObj = restTemplate.getForObject("http://auth-service/api/users/count", Long.class);
                long totalUsers = totalUsersObj != null ? totalUsersObj : 0L;
                Long activeCampaignsObj = restTemplate.getForObject(
                                "http://campaign-service/api/campaigns/active/count",
                                Long.class);
                long activeCampaigns = activeCampaignsObj != null ? activeCampaignsObj : 0L;
                BigDecimal totalRaised = restTemplate.getForObject("http://campaign-service/api/campaigns/totalRaised",
                                BigDecimal.class);
                BigDecimal totalDonations = restTemplate.getForObject(
                                "http://donation-service/api/donations/totalAmount",
                                BigDecimal.class);
                Long totalDonationsCountObj = restTemplate.getForObject("http://donation-service/api/donations/count",
                                Long.class);
                long totalDonationsCount = totalDonationsCountObj != null ? totalDonationsCountObj : 0L;
                stats.put("totalUsers", totalUsers);
                stats.put("activeCampaigns", activeCampaigns);
                stats.put("totalRaised", totalRaised != null ? totalRaised : BigDecimal.ZERO);
                stats.put("totalDonations", totalDonations != null ? totalDonations : BigDecimal.ZERO);
                stats.put("totalDonationsCount", totalDonationsCount);
                return ResponseEntity.ok(stats);
        }

        @GetMapping("/activity")
        public ResponseEntity<Map<String, Object>> getRecentActivity(
                        @RequestParam(defaultValue = "10") int donationsLimit,
                        @RequestParam(defaultValue = "5") int campaignsLimit) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                                authentication.getAuthorities().stream()
                                                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
                Map<String, Object> activity = new HashMap<>();
                // Fetch recent donations and campaigns from other services
                List<?> recentDonations = restTemplate.getForObject(
                                "http://donation-service/api/donations/recent?limit=" + donationsLimit, List.class);
                List<?> recentCampaigns = restTemplate.getForObject(
                                "http://campaign-service/api/campaigns/recent?limit=" + campaignsLimit, List.class);
                activity.put("recentDonations", recentDonations);
                activity.put("recentCampaigns", recentCampaigns);
                return ResponseEntity.ok(activity);
        }

        @PostMapping("/notifyAllUsers")
        public ResponseEntity<String> notifyAllUsers() {
                // Fetch all users from auth-service
                List<Map<String, Object>> users = restTemplate.getForObject("http://auth-service/api/users/all",
                                List.class);
                if (users == null || users.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No users found");
                }
                // Notify each user via notification-service
                for (Map<String, Object> user : users) {
                        String email = (String) user.get("email");
                        if (email != null && !email.isEmpty()) {
                                Map<String, String> notification = new HashMap<>();
                                notification.put("to", email);
                                notification.put("subject", "Important Campaign Update");
                                notification.put("message",
                                                "Dear user, there is an important update regarding our campaigns. Please check the platform for details.");
                                restTemplate.postForObject("http://notification-service/api/notifications/send",
                                                notification, String.class);
                        }
                }
                return ResponseEntity.ok("Notifications sent to all users");
        }
}
