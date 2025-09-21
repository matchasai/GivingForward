package com.example.fundapp.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class DonationRequest {

    @NotNull
    private Long campaignId;

    @NotNull
    @Positive
    private BigDecimal amount;

    public DonationRequest() {
    }

    public DonationRequest(Long campaignId, BigDecimal amount) {
        this.campaignId = campaignId;
        this.amount = amount;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}