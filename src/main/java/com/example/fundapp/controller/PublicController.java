package com.example.fundapp.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fundapp.repository.CampaignRepository;
import com.example.fundapp.repository.UserRepository;
import com.example.fundapp.service.DonationService;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private DonationService donationService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPublicStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long activeCampaigns = campaignRepository.findByIsActiveTrueOrderByCreatedAtDesc().size();
        BigDecimal totalRaised = campaignRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(c -> c.getCurrentAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDonations = donationService.getTotalDonationsAmount();
        long totalDonationsCount = donationService.getTotalDonationsCount();

        stats.put("totalUsers", totalUsers);
        stats.put("activeCampaigns", activeCampaigns);
        stats.put("totalRaised", totalRaised != null ? totalRaised : BigDecimal.ZERO);
        stats.put("totalDonations", totalDonations != null ? totalDonations : BigDecimal.ZERO);
        stats.put("totalDonationsCount", totalDonationsCount);

        return ResponseEntity.ok(stats);
    }
}