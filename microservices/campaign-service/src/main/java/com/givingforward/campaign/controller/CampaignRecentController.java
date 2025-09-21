package com.givingforward.campaign.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.campaign.dto.CampaignDto;
import com.givingforward.campaign.repository.CampaignRepository;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignRecentController {
    @Autowired
    private CampaignRepository campaignRepository;

    @GetMapping("/recent")
    public List<CampaignDto> getRecentCampaigns(@RequestParam(defaultValue = "5") int limit) {
        return campaignRepository.findAll(PageRequest.of(0, limit, Sort.by("createdAt").descending())).getContent()
                .stream()
                .map(c -> new CampaignDto(c.getId(), c.getTitle(), c.getDescription(), c.isActive(),
                        c.getTargetAmount(), c.getCurrentAmount(), c.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
