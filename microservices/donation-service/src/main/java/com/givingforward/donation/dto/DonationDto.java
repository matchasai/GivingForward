package com.givingforward.donation.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DonationDto {
    private Long id;
    private Long userId;
    private Long campaignId;
    private BigDecimal amount;
    private String paymentStatus;
    private LocalDateTime donatedAt;

    public DonationDto(Long id, Long userId, Long campaignId, BigDecimal amount, String paymentStatus,
            LocalDateTime donatedAt) {
        this.id = id;
        this.userId = userId;
        this.campaignId = campaignId;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.donatedAt = donatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public LocalDateTime getDonatedAt() {
        return donatedAt;
    }
}
