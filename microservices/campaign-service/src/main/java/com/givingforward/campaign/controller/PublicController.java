package com.givingforward.campaign.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPublicStats() {
        Map<String, Object> stats = new HashMap<>();

        // Example: Replace URLs with actual service endpoints
        Long totalUsers = restTemplate.getForObject("http://auth-service/api/users/count", Long.class);
        Long activeCampaigns = restTemplate.getForObject("http://campaign-service/api/campaigns/active/count",
                Long.class);
        BigDecimal totalRaised = restTemplate.getForObject("http://campaign-service/api/campaigns/totalRaised",
                BigDecimal.class);
        BigDecimal totalDonations = restTemplate.getForObject("http://donation-service/api/donations/totalAmount",
                BigDecimal.class);
        Long totalDonationsCount = restTemplate.getForObject("http://donation-service/api/donations/count", Long.class);

        stats.put("totalUsers", totalUsers);
        stats.put("activeCampaigns", activeCampaigns);
        stats.put("totalRaised", totalRaised != null ? totalRaised : BigDecimal.ZERO);
        stats.put("totalDonations", totalDonations != null ? totalDonations : BigDecimal.ZERO);
        stats.put("totalDonationsCount", totalDonationsCount);

        return ResponseEntity.ok(stats);
    }
}
