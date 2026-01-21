package com.example.fundapp.model;

import java.time.LocalDateTime;

public class CampaignUpdate {
    private String text;
    private String imageUrl;
    private String createdByName;
    private LocalDateTime createdAt = LocalDateTime.now();

    public CampaignUpdate() {
    }

    public CampaignUpdate(String text, String imageUrl, String createdByName) {
        this.text = text;
        this.imageUrl = imageUrl;
        this.createdByName = createdByName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
