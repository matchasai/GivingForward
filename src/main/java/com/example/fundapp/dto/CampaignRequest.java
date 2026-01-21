package com.example.fundapp.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CampaignRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal targetAmount;

    private String imageUrl;

    private String category;

    private java.time.LocalDateTime endDate;

    public CampaignRequest() {
    }

    public CampaignRequest(String title, String description, BigDecimal targetAmount, String imageUrl, String category,
            java.time.LocalDateTime endDate) {
        this.title = title;
        this.description = description;
        this.targetAmount = targetAmount;
        this.imageUrl = imageUrl;
        this.category = category;
        this.endDate = endDate;
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

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public java.time.LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(java.time.LocalDateTime endDate) {
        this.endDate = endDate;
    }
}
