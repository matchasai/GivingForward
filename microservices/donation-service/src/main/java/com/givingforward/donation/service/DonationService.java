package com.givingforward.donation.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.givingforward.donation.dto.DonationRequest;
import com.givingforward.donation.model.Donation;
import com.givingforward.donation.repository.DonationRepository;

@Service
public class DonationService {
    @Autowired
    private DonationRepository donationRepository;

    public Donation createDonation(DonationRequest request) {
        Donation donation = new Donation();
        donation.setAmount(request.getAmount());
        donation.setUserId(request.getUserId());
        donation.setCampaignId(request.getCampaignId());
        donation.setPaymentStatus("PENDING");
        return donationRepository.save(donation);
    }

    public List<Donation> getDonationsByCampaign(Long campaignId) {
        return donationRepository.findAll().stream()
                .filter(d -> d.getCampaignId().equals(campaignId))
                .toList();
    }

    public List<Donation> getDonationsByUser(Long userId) {
        return donationRepository.findAll().stream()
                .filter(d -> d.getUserId().equals(userId))
                .toList();
    }
}
