package com.givingforward.donation.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.givingforward.donation.model.Donation;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.paymentStatus = 'PAID'")
    BigDecimal getTotalDonationsAmount();

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.paymentStatus = 'PAID'")
    long countTotalDonations();
}
