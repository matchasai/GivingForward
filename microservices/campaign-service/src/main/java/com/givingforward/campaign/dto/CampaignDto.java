package com.givingforward.campaign.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CampaignDto {
    private Long id;
    private String title;
    private String description;
    private boolean active;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private LocalDateTime createdAt;

    public CampaignDto(Long id, String title, String description, boolean active, BigDecimal targetAmount,
            BigDecimal currentAmount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.active = active;
        this.targetAmount = targetAmount;
        this.currentAmount = currentAmount;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public BigDecimal getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(BigDecimal currentAmount) {
        this.currentAmount = currentAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}