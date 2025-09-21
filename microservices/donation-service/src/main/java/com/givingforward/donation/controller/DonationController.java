package com.givingforward.donation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.donation.dto.DonationRequest;
import com.givingforward.donation.model.Donation;
import com.givingforward.donation.service.DonationService;

@RestController
@RequestMapping("/api/donations")
public class DonationController {
    @Autowired
    private DonationService donationService;

    @PostMapping
    public Donation createDonation(@RequestBody DonationRequest request) {
        return donationService.createDonation(request);
    }

    @GetMapping("/campaign/{campaignId}")
    public List<Donation> getDonationsByCampaign(@PathVariable Long campaignId) {
        return donationService.getDonationsByCampaign(campaignId);
    }

    @GetMapping("/user/{userId}")
    public List<Donation> getDonationsByUser(@PathVariable Long userId) {
        return donationService.getDonationsByUser(userId);
    }
}
