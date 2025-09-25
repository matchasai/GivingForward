package com.example.fundapp.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Document(collection = "donations")
public class Donation {

    @Id
    private String id;

    @DBRef(lazy = true)
    private User user;

    @DBRef(lazy = true)
    private Campaign campaign;

    @NotNull
    @Positive
    private BigDecimal amount;

    private LocalDateTime donatedAt = LocalDateTime.now();

    private PaymentStatus paymentStatus = PaymentStatus.PAID;

    public enum PaymentStatus {
        PENDING, PAID, FAILED
    }

    // Constructors
    public Donation() {
    }

    public Donation(User user, Campaign campaign, BigDecimal amount) {
        this.user = user;
        this.campaign = campaign;
        this.amount = amount;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getDonatedAt() {
        return donatedAt;
    }

    public void setDonatedAt(LocalDateTime donatedAt) {
        this.donatedAt = donatedAt;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}