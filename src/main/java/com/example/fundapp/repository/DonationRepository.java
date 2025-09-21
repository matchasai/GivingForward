package com.example.fundapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.fundapp.model.Donation;
import com.example.fundapp.model.User;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long>, JpaSpecificationExecutor<Donation> {
    List<Donation> findByUserOrderByDonatedAtDesc(User user);

    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.paymentStatus = 'PAID'")
    java.math.BigDecimal getTotalDonationsAmount();

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.paymentStatus = 'PAID'")
    long countTotalDonations();

    @Modifying
    @Query("DELETE FROM Donation d WHERE d.campaign.id = :campaignId")
    void deleteByCampaignId(Long campaignId);
}