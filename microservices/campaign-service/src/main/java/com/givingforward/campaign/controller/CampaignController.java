package com.givingforward.campaign.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.campaign.dto.CampaignDto;
import com.givingforward.campaign.dto.CampaignRequest;
import com.givingforward.campaign.model.Campaign;
import com.givingforward.campaign.service.CampaignService;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {
    @Autowired
    private CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<CampaignDto>> getAllCampaigns() {
        List<CampaignDto> dtos = campaignService.getAllCampaigns().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignDto> getCampaign(@PathVariable Long id) {
        Optional<Campaign> campaign = campaignService.getCampaignById(id);
        return campaign.map(c -> ResponseEntity.ok(toDto(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CampaignDto> createCampaign(@RequestBody CampaignRequest request) {
        Campaign campaign = campaignService.createCampaign(request);
        return ResponseEntity.ok(toDto(campaign));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignDto> updateCampaign(@PathVariable Long id, @RequestBody CampaignRequest request) {
        Campaign campaign = campaignService.updateCampaign(id, request);
        return ResponseEntity.ok(toDto(campaign));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }

    private CampaignDto toDto(Campaign c) {
        return new CampaignDto(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.isActive(),
                c.getTargetAmount(),
                c.getCurrentAmount(),
                c.getCreatedAt());
    }
}