package com.example.fundapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DonationDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long campaignId;
    private String campaignTitle;
    private BigDecimal amount;
    private String paymentStatus;
    private LocalDateTime donatedAt;

    public DonationDto() {
    }

    public DonationDto(Long id, Long userId, String userName, String userEmail, Long campaignId, String campaignTitle,
            BigDecimal amount, String paymentStatus, LocalDateTime donatedAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.campaignId = campaignId;
        this.campaignTitle = campaignTitle;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.donatedAt = donatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getCampaignTitle() {
        return campaignTitle;
    }

    public void setCampaignTitle(String campaignTitle) {
        this.campaignTitle = campaignTitle;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getDonatedAt() {
        return donatedAt;
    }

    public void setDonatedAt(LocalDateTime donatedAt) {
        this.donatedAt = donatedAt;
    }
}
