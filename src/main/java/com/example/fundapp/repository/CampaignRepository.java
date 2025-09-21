package com.example.fundapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.fundapp.model.Campaign;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long>, JpaSpecificationExecutor<Campaign> {
    List<Campaign> findByIsActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT COUNT(c) FROM Campaign c WHERE c.isActive = true")
    long countActiveCampaigns();

    @Query("SELECT SUM(c.currentAmount) FROM Campaign c WHERE c.isActive = true")
    java.math.BigDecimal getTotalRaisedAmount();
}