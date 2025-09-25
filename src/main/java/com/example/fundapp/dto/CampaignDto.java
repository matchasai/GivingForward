package com.example.fundapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CampaignDto {
    private String id;
    private String title;
    private String description;
    private boolean active;
    private BigDecimal goalAmount;
    private BigDecimal currentAmount;
    private LocalDateTime createdAt;

    public CampaignDto() {
    }

    public CampaignDto(String id, String title, String description, boolean active, BigDecimal goalAmount,
            BigDecimal currentAmount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.active = active;
        this.goalAmount = goalAmount;
        this.currentAmount = currentAmount;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public BigDecimal getGoalAmount() {
        return goalAmount;
    }

    public void setGoalAmount(BigDecimal goalAmount) {
        this.goalAmount = goalAmount;
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
