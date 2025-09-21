package com.example.fundapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

import jakarta.persistence.criteria.Predicate;
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
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false) String status) {

        String[] sortParts = sort.split(",");
        Sort s = sortParts.length == 2 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.by(sortParts[0]).ascending()
                : Sort.by(sortParts[0]).descending();
        Pageable pageable = PageRequest.of(page, size, s);

        Specification<Donation> spec = (root, query, cb) -> {
            java.util.ArrayList<Predicate> predicates = new java.util.ArrayList<>();
            if (userId != null) {
                predicates.add(cb.equal(root.get("user").get("id"), userId));
            }
            if (campaignId != null) {
                predicates.add(cb.equal(root.get("campaign").get("id"), campaignId));
            }
            if (status != null && !status.isBlank()) {
                predicates
                        .add(cb.equal(root.get("paymentStatus"), Donation.PaymentStatus.valueOf(status.toUpperCase())));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<DonationDto> pageDto = donationRepository.findAll(spec, pageable).map(this::toDto);
        return ResponseEntity.ok(pageDto);
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<DonationDto>> getDonationsByCampaign(@PathVariable Long campaignId) {
        List<DonationDto> list = donationRepository.findAll().stream()
                .filter(d -> d.getCampaign() != null && d.getCampaign().getId().equals(campaignId))
                .sorted((a, b) -> b.getDonatedAt().compareTo(a.getDonatedAt()))
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(list);
    }

    private DonationDto toDto(Donation d) {
        Long uId = d.getUser() != null ? d.getUser().getId() : null;
        String uName = d.getUser() != null ? d.getUser().getName() : null;
        String uEmail = d.getUser() != null ? d.getUser().getEmail() : null;
        Long cId = d.getCampaign() != null ? d.getCampaign().getId() : null;
        String cTitle = d.getCampaign() != null ? d.getCampaign().getTitle() : null;
        return new DonationDto(
                d.getId(), uId, uName, uEmail, cId, cTitle, d.getAmount(),
                d.getPaymentStatus() != null ? d.getPaymentStatus().name() : null,
                d.getDonatedAt());
    }
}