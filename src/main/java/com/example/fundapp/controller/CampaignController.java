package com.example.fundapp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
import com.example.fundapp.model.Campaign;
import com.example.fundapp.repository.CampaignRepository;
import com.example.fundapp.service.CampaignService;

import jakarta.persistence.criteria.Predicate;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {
    @PostMapping("/{id}/notify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> notifyUsersAboutCampaign(@PathVariable Long id) {
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
    public ResponseEntity<Campaign> getCampaign(@PathVariable Long id) {
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
    public ResponseEntity<Campaign> updateCampaign(@PathVariable Long id, @Valid @RequestBody CampaignRequest request) {
        Campaign campaign = campaignService.updateCampaign(id, request);
        return ResponseEntity.ok(campaign);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Campaign> toggleCampaignStatus(@PathVariable Long id) {
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

        Specification<Campaign> spec = (root, query, cb) -> {
            java.util.ArrayList<Predicate> predicates = new java.util.ArrayList<>();
            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), like));
            }
            if (active != null) {
                predicates.add(cb.equal(root.get("isActive"), active));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<CampaignDto> pageDto = campaignRepository.findAll(spec, pageable).map(this::toDto);
        return ResponseEntity.ok(pageDto);
    }

    private CampaignDto toDto(Campaign c) {
        return new CampaignDto(
                c.getId(), c.getTitle(), c.getDescription(), c.isActive(), c.getTargetAmount(), c.getCurrentAmount(),
                c.getCreatedAt());
    }
}