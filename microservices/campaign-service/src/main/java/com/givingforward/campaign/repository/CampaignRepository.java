package com.givingforward.campaign.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.givingforward.campaign.model.Campaign;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    @Query("SELECT COUNT(c) FROM Campaign c WHERE c.isActive = true")
    long countActiveCampaigns();

    @Query("SELECT SUM(c.currentAmount) FROM Campaign c WHERE c.isActive = true")
    BigDecimal getTotalRaisedAmount();
}