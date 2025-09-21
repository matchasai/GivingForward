package com.givingforward.campaign.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.givingforward.campaign.dto.CampaignRequest;
import com.givingforward.campaign.model.Campaign;
import com.givingforward.campaign.repository.CampaignRepository;

@Service
public class CampaignService {
    @Autowired
    private CampaignRepository campaignRepository;

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Optional<Campaign> getCampaignById(Long id) {
        return campaignRepository.findById(id);
    }

    public Campaign createCampaign(CampaignRequest request) {
        Campaign campaign = new Campaign();
        campaign.setTitle(request.getTitle());
        campaign.setDescription(request.getDescription());
        campaign.setTargetAmount(request.getTargetAmount());
        return campaignRepository.save(campaign);
    }

    public Campaign updateCampaign(Long id, CampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow();
        campaign.setTitle(request.getTitle());
        campaign.setDescription(request.getDescription());
        campaign.setTargetAmount(request.getTargetAmount());
        return campaignRepository.save(campaign);
    }

    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }
}