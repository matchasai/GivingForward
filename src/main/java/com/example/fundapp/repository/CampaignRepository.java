package com.example.fundapp.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.fundapp.model.Campaign;

@Repository
public interface CampaignRepository extends MongoRepository<Campaign, String> {
    List<Campaign> findByIsActiveTrueOrderByCreatedAtDesc();
}