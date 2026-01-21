package com.example.fundapp.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.fundapp.dto.CampaignDto;
import com.example.fundapp.dto.CampaignRequest;
import com.example.fundapp.dto.CampaignUpdateRequest;
import com.example.fundapp.model.Campaign;
import com.example.fundapp.model.CampaignUpdate;
import com.example.fundapp.repository.CampaignRepository;
import com.example.fundapp.service.CampaignService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {
    @PostMapping("/{id}/notify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> notifyUsersAboutCampaign(@PathVariable String id) {
        campaignService.notifyUsersAboutCampaign(id);
        return ResponseEntity.ok().build();
    }

    @Autowired
    private CampaignService campaignService;

    @Autowired
    private CampaignRepository campaignRepository;

    @GetMapping("/active")
    public ResponseEntity<List<Campaign>> getActiveCampaigns() {
        List<Campaign> campaigns = campaignService.getActiveCampaigns();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaign(@PathVariable String id) {
        Optional<Campaign> campaign = campaignService.getCampaignById(id);
        return campaign.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Campaign> createCampaign(@Valid @RequestBody CampaignRequest request) {
        Campaign campaign = campaignService.createCampaign(request);
        return ResponseEntity.ok(campaign);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Campaign> updateCampaign(@PathVariable String id,
            @Valid @RequestBody CampaignRequest request) {
        Campaign campaign = campaignService.updateCampaign(id, request);
        return ResponseEntity.ok(campaign);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCampaign(@PathVariable String id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Campaign> toggleCampaignStatus(@PathVariable String id) {
        Campaign campaign = campaignService.toggleCampaignStatus(id);
        return ResponseEntity.ok(campaign);
    }

    @GetMapping
    public ResponseEntity<Page<CampaignDto>> getAllCampaigns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean active) {

        String[] sortParts = sort.split(",");
        Sort s = sortParts.length == 2 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.by(sortParts[0]).ascending()
                : Sort.by(sortParts[0]).descending();
        Pageable pageable = PageRequest.of(page, size, s);

        // Delegate filtering to service layer
        Page<CampaignDto> pageDto = campaignService.getCampaignsWithFilters(pageable, search, active);
        return ResponseEntity.ok(pageDto);
    }

    /**
     * Get analytics data for a specific campaign
     */
    @GetMapping("/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getCampaignAnalytics(@PathVariable String id) {
        Map<String, Object> analytics = campaignService.getCampaignAnalytics(id);
        return ResponseEntity.ok(analytics);
    }

    /**
     * Admin: Add an update to a campaign
     */
    @PostMapping("/{id}/updates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CampaignUpdate>> addUpdate(@PathVariable String id,
            @Valid @RequestBody CampaignUpdateRequest request) {
        List<CampaignUpdate> updates = campaignService.addCampaignUpdate(id, request.getText(), request.getImageUrl());
        return ResponseEntity.ok(updates);
    }

    /**
     * Get updates timeline for a campaign
     */
    @GetMapping("/{id}/updates")
    public ResponseEntity<List<CampaignUpdate>> getUpdates(@PathVariable String id) {
        List<CampaignUpdate> updates = campaignService.getCampaignUpdates(id);
        return ResponseEntity.ok(updates);
    }
}