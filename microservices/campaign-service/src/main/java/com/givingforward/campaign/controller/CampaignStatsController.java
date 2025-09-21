package com.givingforward.campaign.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.campaign.repository.CampaignRepository;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignStatsController {
    @Autowired
    private CampaignRepository campaignRepository;

    @GetMapping("/active/count")
    public long getActiveCampaignsCount() {
        return campaignRepository.countActiveCampaigns();
    }

    @GetMapping("/totalRaised")
    public BigDecimal getTotalRaisedAmount() {
        return campaignRepository.getTotalRaisedAmount();
    }
}
