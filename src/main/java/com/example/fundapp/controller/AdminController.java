package com.example.fundapp.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.fundapp.dto.CampaignDto;
import com.example.fundapp.dto.DonationDto;
import com.example.fundapp.model.Campaign;
import com.example.fundapp.model.Donation;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.CampaignRepository;
import com.example.fundapp.repository.DonationRepository;
import com.example.fundapp.repository.UserRepository;
import com.example.fundapp.service.DonationService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CampaignRepository campaignRepository;

        @Autowired
        private DonationRepository donationRepository;

        @Autowired
        private DonationService donationService;

        @GetMapping("/stats")
        public ResponseEntity<Map<String, Object>> getStats() {
                // Check if user is authenticated and has ADMIN role
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                                !authentication.getAuthorities().stream()
                                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }

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
                stats.put("totalDonations", totalDonations);
                stats.put("totalDonationsCount", totalDonationsCount);

                return ResponseEntity.ok(stats);
        }

        @GetMapping("/activity")
        public ResponseEntity<Map<String, Object>> getRecentActivity(
                        @RequestParam(defaultValue = "10") int donationsLimit,
                        @RequestParam(defaultValue = "5") int campaignsLimit) {
                // Check if user is authenticated and has ADMIN role
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                                !authentication.getAuthorities().stream()
                                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }

                Map<String, Object> activity = new HashMap<>();

                // Get recent donations sorted by donatedAt desc limited
                List<Donation> recentDonations = donationRepository.findAll(
                                PageRequest.of(0, donationsLimit, Sort.by("donatedAt").descending())).getContent();

                // Get recent campaigns sorted by createdAt desc limited
                List<Campaign> recentCampaigns = campaignRepository.findAll(
                                PageRequest.of(0, campaignsLimit, Sort.by("createdAt").descending())).getContent();

                List<DonationDto> donationDtos = recentDonations.stream().map(d -> new DonationDto(
                                d.getId(),
                                d.getUser() != null ? d.getUser().getId() : null,
                                d.getUser() != null ? d.getUser().getName() : null,
                                d.getUser() != null ? d.getUser().getEmail() : null,
                                d.getCampaign() != null ? d.getCampaign().getId() : null,
                                d.getCampaign() != null ? d.getCampaign().getTitle() : null,
                                d.getAmount(),
                                d.getPaymentStatus() != null ? d.getPaymentStatus().name() : null,
                                d.getDonatedAt())).toList();

                List<CampaignDto> campaignDtos = recentCampaigns.stream().map(c -> new CampaignDto(
                                c.getId(), c.getTitle(), c.getDescription(), c.isActive(), c.getTargetAmount(),
                                c.getCurrentAmount(),
                                c.getCreatedAt())).toList();

                activity.put("recentDonations", donationDtos);
                activity.put("recentCampaigns", campaignDtos);

                return ResponseEntity.ok(activity);
        }

        @PostMapping("/donations/reassign")
        public ResponseEntity<Map<String, Object>> reassignDonations(@RequestParam String fromEmail,
                        @RequestParam String toEmail,
                        @RequestParam(required = false) String since) {
                // Check if user is authenticated and has ADMIN role
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                                !authentication.getAuthorities().stream()
                                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }

                User fromUser = userRepository.findByEmail(fromEmail).orElse(null);
                User toUser = userRepository.findByEmail(toEmail).orElse(null);

                if (fromUser == null) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(Map.of("message", "Source user not found: " + fromEmail));
                }
                if (toUser == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(Map.of("message", "Target user not found: " + toEmail));
                }

                // Reassign donations from fromUser to toUser, optional date filter
                var donations = donationRepository.findByUserOrderByDonatedAtDesc(fromUser);
                java.time.LocalDateTime sinceTs = null;
                if (since != null && !since.isBlank()) {
                        try {
                                sinceTs = java.time.LocalDateTime.parse(since);
                        } catch (Exception e) {
                                return ResponseEntity.badRequest().body(Map.of(
                                                "message",
                                                "Invalid 'since' format. Use ISO-8601 like 2025-09-23T00:00:00"));
                        }
                }

                long total = 0L;
                for (var d : donations) {
                        if (sinceTs != null && (d.getDonatedAt() == null || d.getDonatedAt().isBefore(sinceTs))) {
                                continue;
                        }
                        d.setUser(toUser);
                        total++;
                }
                donationRepository.saveAll(donations);

                Map<String, Object> result = new HashMap<>();
                result.put("reassignedCount", total);
                result.put("fromEmail", fromEmail);
                result.put("toEmail", toEmail);
                if (sinceTs != null)
                        result.put("since", sinceTs.toString());
                return ResponseEntity.ok(result);
        }

        // Removed EntityManager (JPA) in MongoDB setup

}