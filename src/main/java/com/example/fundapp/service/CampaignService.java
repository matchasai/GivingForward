package com.example.fundapp.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.fundapp.constants.AppConstants;
import com.example.fundapp.dto.CampaignDto;
import com.example.fundapp.dto.CampaignRequest;
import com.example.fundapp.model.Campaign;
import com.example.fundapp.model.Donation;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.CampaignRepository;
import com.example.fundapp.repository.DonationRepository;
import com.example.fundapp.repository.UserRepository;

@Service
public class CampaignService {

    private static final Logger log = LoggerFactory.getLogger(CampaignService.class);

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private EmailService emailService;

    public void notifyUsersAboutCampaign(String campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        emailService.sendCampaignNotificationToAllUsers(campaign);
    }

    public List<Campaign> getActiveCampaigns() {
        return campaignRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public Optional<Campaign> getCampaignById(String id) {
        return campaignRepository.findById(id);
    }

    public Campaign createCampaign(CampaignRequest request) {
        try {
            // Get the current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            User currentUser = null;

            if (authentication != null && authentication.getName() != null &&
                    !authentication.getName().equals("anonymousUser")) {

                String currentUserEmail = authentication.getName();
                // minimal diagnostic retained via warnings below when needed

                Optional<User> userOptional = userRepository.findByEmail(currentUserEmail);
                if (userOptional.isPresent()) {
                    currentUser = userOptional.get();
                    // found user; no additional debug logging
                } else {
                    log.warn("Authenticated user not found in database: {}", currentUserEmail);
                }
            }

            // Fallback: Use admin user if no authenticated user found
            if (currentUser == null) {
                currentUser = userRepository.findByEmail(AppConstants.DEFAULT_ADMIN_EMAIL)
                        .orElseThrow(() -> new RuntimeException("Admin user not found for fallback"));
                // using fallback admin user silently
            }

            Campaign campaign = new Campaign();
            campaign.setTitle(request.getTitle());
            campaign.setDescription(request.getDescription());
            campaign.setTargetAmount(request.getTargetAmount());
            campaign.setImageUrl(request.getImageUrl());
            campaign.setCreatedBy(currentUser);

            Campaign savedCampaign = campaignRepository.save(campaign);
            // saved successfully

            // Optionally, you can trigger email notifications here if desired

            return savedCampaign;
        } catch (Exception e) {
            log.error("Error creating campaign: {}", e.getMessage());
            throw new RuntimeException("Failed to create campaign: " + e.getMessage(), e);
        }
    }

    public Campaign updateCampaign(String id, CampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaign.setTitle(request.getTitle());
        campaign.setDescription(request.getDescription());
        campaign.setTargetAmount(request.getTargetAmount());
        if (request.getImageUrl() != null) {
            campaign.setImageUrl(request.getImageUrl());
        }

        return campaignRepository.save(campaign);
    }

    @Transactional
    public void deleteCampaign(String id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        // First delete all donations associated with this campaign
        var donations = donationRepository.findByCampaign_Id(id);
        donationRepository.deleteAll(donations);

        // Then delete the campaign
        campaignRepository.delete(campaign);
    }

    public Campaign toggleCampaignStatus(String id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaign.setActive(!campaign.isActive());
        return campaignRepository.save(campaign);
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    /**
     * Get campaigns with filtering, sorting, and pagination
     */
    public Page<CampaignDto> getCampaignsWithFilters(
            Pageable pageable,
            String search,
            Boolean active) {
        
        List<Campaign> allCampaigns = campaignRepository.findAll();
        
        // Apply filters
        List<Campaign> filtered = allCampaigns.stream()
                .filter(c -> search == null || search.isBlank()
                        || c.getTitle().toLowerCase().contains(search.toLowerCase()))
                .filter(c -> active == null || c.isActive() == active)
                .toList();
        
        // Apply pagination
        int start = Math.min((int) pageable.getOffset(), filtered.size());
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        
        List<CampaignDto> campaignDtos = filtered.subList(start, end).stream()
                .map(this::convertToDto)
                .toList();
        
        return new PageImpl<>(campaignDtos, pageable, filtered.size());
    }
    
    private CampaignDto convertToDto(Campaign c) {
        return new CampaignDto(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.isActive(),
                c.getTargetAmount(),
                c.getCurrentAmount(),
                c.getCreatedAt());
    }

    /**
     * Get analytics data for a campaign including donation trends
     */
    public Map<String, Object> getCampaignAnalytics(String campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        
        var donations = donationRepository.findByCampaign_Id(campaignId);
        
        // Calculate statistics
        long totalDonations = donations.size();
        BigDecimal totalAmount = donations.stream()
                .map(d -> d.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal avgDonation = totalDonations > 0 
                ? totalAmount.divide(BigDecimal.valueOf(totalDonations), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        
        // Group donations by date for chart
        var donationsByDate = donations.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDonatedAt().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO, 
                                Donation::getAmount, 
                                BigDecimal::add)
                ));
        
        // Convert to list of maps for frontend
        var chartData = donationsByDate.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> Map.of(
                        "date", entry.getKey().toString(),
                        "amount", entry.getValue()
                ))
                .collect(Collectors.toList());
        
        return Map.of(
                "totalDonations", totalDonations,
                "totalAmount", totalAmount,
                "averageDonation", avgDonation,
                "targetAmount", campaign.getTargetAmount(),
                "currentAmount", campaign.getCurrentAmount(),
                "progressPercentage", campaign.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                        ? campaign.getCurrentAmount()
                                .divide(campaign.getTargetAmount(), 4, java.math.RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100))
                        : BigDecimal.ZERO,
                "chartData", chartData
        );
    }
}