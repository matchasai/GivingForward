package com.example.fundapp.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public Donation makeDonation(DonationRequest request) {
        // For now, use a default user since we removed JWT authentication
        User currentUser = userRepository.findByEmail("user@fundapp.com")
                .orElseThrow(() -> new RuntimeException("Default user not found"));

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

    public List<Donation> getUserDonations() {
        // For now, use a default user since we removed JWT authentication
        User currentUser = userRepository.findByEmail("user@fundapp.com")
                .orElseThrow(() -> new RuntimeException("Default user not found"));

        return donationRepository.findByUserOrderByDonatedAtDesc(currentUser);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public BigDecimal getTotalDonationsAmount() {
        BigDecimal total = donationRepository.getTotalDonationsAmount();
        return total != null ? total : BigDecimal.ZERO;
    }

    public long getTotalDonationsCount() {
        return donationRepository.countTotalDonations();
    }
}