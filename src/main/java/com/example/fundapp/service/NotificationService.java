package com.example.fundapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.fundapp.constants.AppConstants;
import com.example.fundapp.model.Notification;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User user, String message) {
        Notification notification = new Notification(user, message);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        if (user == null) return List.of();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        if (user == null) return List.of();
        return notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, false);
    }

    public long getUnreadCount(User user) {
        if (user == null) return 0L;
        return notificationRepository.countByUserAndRead(user, false);
    }

    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(User user) {
        if (user == null) return;
        List<Notification> notifications = notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, false);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void deleteAllUserNotifications(User user) {
        if (user == null) return;
        notificationRepository.deleteByUser(user);
    }

    // Helper methods for creating specific notification types
    public void notifyDonationReceived(User campaignCreator, String campaignTitle, String amount) {
        String message = String.format("New donation of %s received for campaign '%s'", amount, campaignTitle);
        createNotification(campaignCreator, message);
    }

    public void notifyCampaignStatusChanged(User user, String campaignTitle, boolean active) {
        String status = active ? "activated" : "deactivated";
        String message = String.format("Campaign '%s' has been %s", campaignTitle, status);
        createNotification(user, message);
    }

    public void notifyPasswordChanged(User user) {
        createNotification(user, AppConstants.MSG_PASSWORD_CHANGED);
    }
}
