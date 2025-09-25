package com.example.fundapp.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.fundapp.model.Donation;
import com.example.fundapp.model.User;

@Repository
public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByUserOrderByDonatedAtDesc(User user);

    List<Donation> findByCampaign_Id(String campaignId);
}