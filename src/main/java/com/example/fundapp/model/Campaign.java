package com.example.fundapp.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Document(collection = "campaigns")
public class Campaign {

    @Id
    private String id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal targetAmount;

    @NotNull
    @PositiveOrZero
    private BigDecimal currentAmount = BigDecimal.ZERO;

    private String imageUrl;

    private String category; // Medical, Education, Disaster Relief, Community, Other

    private LocalDateTime endDate; // Optional campaign end date

    @DBRef(lazy = true)
    private User createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean isActive = true;

    private List<CampaignUpdate> updates = new ArrayList<>();

    // Constructors
    public Campaign() {
    }

    public Campaign(String title, String description, BigDecimal targetAmount, User createdBy) {
        this.title = title;
        this.description = description;
        this.targetAmount = targetAmount;
        this.createdBy = createdBy;
    }

    // Getters and Setters
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

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public List<CampaignUpdate> getUpdates() {
        return updates;
    }

    public void setUpdates(List<CampaignUpdate> updates) {
        this.updates = updates;
    }

    // Helper methods
    public BigDecimal getProgressPercentage() {
        if (targetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return currentAmount.divide(targetAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    public boolean isFullyFunded() {
        return currentAmount.compareTo(targetAmount) >= 0;
    }

    public boolean isEnded() {
        return endDate != null && LocalDateTime.now().isAfter(endDate);
    }
}