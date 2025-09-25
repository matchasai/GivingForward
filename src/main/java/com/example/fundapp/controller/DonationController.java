package com.example.fundapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.fundapp.dto.DonationDto;
import com.example.fundapp.dto.DonationRequest;
import com.example.fundapp.model.Donation;
import com.example.fundapp.repository.DonationRepository;
import com.example.fundapp.service.DonationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private DonationRepository donationRepository;

    @PostMapping
    public ResponseEntity<Donation> makeDonation(@Valid @RequestBody DonationRequest request) {
        Donation donation = donationService.makeDonation(request);
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Donation>> getUserDonations() {
        List<Donation> donations = donationService.getUserDonations();
        return ResponseEntity.ok(donations);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DonationDto>> getAllDonations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "donatedAt,desc") String sort,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String campaignId,
            @RequestParam(required = false) String status) {

        String[] sortParts = sort.split(",");
        Sort s = sortParts.length == 2 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.by(sortParts[0]).ascending()
                : Sort.by(sortParts[0]).descending();
        Pageable pageable = PageRequest.of(page, size, s);

        var all = donationRepository.findAll();
        var filtered = all.stream()
                .filter(d -> userId == null || d.getUser() != null && userId.equals(d.getUser().getId()))
                .filter(d -> campaignId == null
                        || d.getCampaign() != null && campaignId.equals(d.getCampaign().getId()))
                .filter(d -> status == null || status.isBlank() || (d.getPaymentStatus() != null
                        && d.getPaymentStatus().name().equalsIgnoreCase(status)))
                .sorted((a, b) -> {
                    var prop = sortParts[0];
                    int cmp;
                    switch (prop) {
                        case "donatedAt":
                            cmp = a.getDonatedAt().compareTo(b.getDonatedAt());
                            break;
                        case "amount":
                            cmp = a.getAmount().compareTo(b.getAmount());
                            break;
                        default:
                            cmp = String.valueOf(a.getId()).compareTo(String.valueOf(b.getId()));
                    }
                    return sortParts.length == 2 && sortParts[1].equalsIgnoreCase("asc") ? cmp : -cmp;
                })
                .toList();
        int start = Math.min((int) pageable.getOffset(), filtered.size());
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        Page<DonationDto> pageDto = new PageImpl<>(filtered.subList(start, end).stream().map(this::toDto).toList(),
                pageable, filtered.size());
        return ResponseEntity.ok(pageDto);
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<DonationDto>> getDonationsByCampaign(@PathVariable String campaignId) {
        List<DonationDto> list = donationRepository.findByCampaign_Id(campaignId).stream()
                .sorted((a, b) -> b.getDonatedAt().compareTo(a.getDonatedAt()))
                // Show real donor details (per requirement)
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(list);
    }

    private DonationDto toDto(Donation d) {
        String uId = d.getUser() != null ? d.getUser().getId() : null;
        String uName = d.getUser() != null ? d.getUser().getName() : null;
        String uEmail = d.getUser() != null ? d.getUser().getEmail() : null;
        String cId = d.getCampaign() != null ? d.getCampaign().getId() : null;
        String cTitle = d.getCampaign() != null ? d.getCampaign().getTitle() : null;
        return new DonationDto(
                d.getId(), uId, uName, uEmail, cId, cTitle, d.getAmount(),
                d.getPaymentStatus() != null ? d.getPaymentStatus().name() : null,
                d.getDonatedAt());
    }

    // Note: if public anonymity is desired later, reintroduce an anonymized mapper.
}