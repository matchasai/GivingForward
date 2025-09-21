package com.givingforward.donation.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.donation.dto.DonationDto;
import com.givingforward.donation.repository.DonationRepository;

@RestController
@RequestMapping("/api/donations")
public class DonationRecentController {
    @Autowired
    private DonationRepository donationRepository;

    @GetMapping("/recent")
    public List<DonationDto> getRecentDonations(@RequestParam(defaultValue = "10") int limit) {
        return donationRepository.findAll(PageRequest.of(0, limit, Sort.by("donatedAt").descending())).getContent()
                .stream()
                .map(d -> new DonationDto(d.getId(), d.getUserId(), d.getCampaignId(), d.getAmount(),
                        d.getPaymentStatus(), d.getDonatedAt()))
                .collect(Collectors.toList());
    }
}
