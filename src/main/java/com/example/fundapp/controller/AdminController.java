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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.fundapp.dto.CampaignDto;
import com.example.fundapp.dto.DonationDto;
import com.example.fundapp.model.Campaign;
import com.example.fundapp.model.Donation;
import com.example.fundapp.repository.CampaignRepository;
import com.example.fundapp.repository.DonationRepository;
import com.example.fundapp.repository.UserRepository;
import com.example.fundapp.service.DonationService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

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
                long activeCampaigns = campaignRepository.countActiveCampaigns();
                BigDecimal totalRaised = campaignRepository.getTotalRaisedAmount();
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

        @PersistenceContext
        private EntityManager entityManager;

}