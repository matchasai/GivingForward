package com.example.fundapp.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

import com.example.fundapp.dto.DonationRequest;
import com.example.fundapp.model.Campaign;
import com.example.fundapp.model.Donation;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.CampaignRepository;
import com.example.fundapp.repository.DonationRepository;
import com.example.fundapp.repository.UserRepository;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private UserRepository userRepository;

    public Donation makeDonation(DonationRequest request) {
        // Prefer authenticated user if present; fall back to default seeded user
        User currentUser = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
                String email = ((UserDetails) auth.getPrincipal()).getUsername();
                currentUser = userRepository.findByEmail(email).orElse(null);
            }
        } catch (Exception ignored) {
        }

        // If no authenticated user, leave as anonymous (null) so UI can display
        // "Anonymous Donor"

        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        if (!campaign.isActive()) {
            throw new RuntimeException("Campaign is not active");
        }

        // Create donation
        Donation donation = new Donation(currentUser, campaign, request.getAmount());
        donation.setPaymentStatus(Donation.PaymentStatus.PAID); // Fake payment always succeeds

        Donation savedDonation = donationRepository.save(donation);

        // Update campaign current amount
        campaign.setCurrentAmount(campaign.getCurrentAmount().add(request.getAmount()));
        campaignRepository.save(campaign);

        return savedDonation;
    }

    public Donation makeDonationForUser(User user, DonationRequest request) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        if (!campaign.isActive()) {
            throw new RuntimeException("Campaign is not active");
        }

        Donation donation = new Donation(user, campaign, request.getAmount());
        donation.setPaymentStatus(Donation.PaymentStatus.PAID);
        Donation savedDonation = donationRepository.save(donation);

        campaign.setCurrentAmount(campaign.getCurrentAmount().add(request.getAmount()));
        campaignRepository.save(campaign);

        return savedDonation;
    }

    public List<Donation> getUserDonations() {
        // Return only the authenticated user's donations
        User currentUser = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
                String email = ((UserDetails) auth.getPrincipal()).getUsername();
                currentUser = userRepository.findByEmail(email).orElse(null);
            }
        } catch (Exception ignored) {
        }

        if (currentUser == null) {
            // Unauthenticated -> no personal donations
            return java.util.Collections.emptyList();
        }

        return donationRepository.findByUserOrderByDonatedAtDesc(currentUser);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public BigDecimal getTotalDonationsAmount() {
        return donationRepository.findAll().stream()
                .filter(d -> d.getPaymentStatus() == Donation.PaymentStatus.PAID)
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public long getTotalDonationsCount() {
        return donationRepository.findAll().stream()
                .filter(d -> d.getPaymentStatus() == Donation.PaymentStatus.PAID)
                .count();
    }
}