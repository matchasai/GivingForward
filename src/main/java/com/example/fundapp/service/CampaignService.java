package com.example.fundapp.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.fundapp.dto.CampaignRequest;
import com.example.fundapp.model.Campaign;
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
                currentUser = userRepository.findByEmail("admin@fundapp.com")
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
}