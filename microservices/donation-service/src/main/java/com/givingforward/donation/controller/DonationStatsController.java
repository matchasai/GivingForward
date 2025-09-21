package com.givingforward.donation.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.donation.repository.DonationRepository;

@RestController
@RequestMapping("/api/donations")
public class DonationStatsController {
    @Autowired
    private DonationRepository donationRepository;

    @GetMapping("/totalAmount")
    public BigDecimal getTotalDonationsAmount() {
        return donationRepository.getTotalDonationsAmount();
    }

    @GetMapping("/count")
    public long getTotalDonationsCount() {
        return donationRepository.countTotalDonations();
    }
}
