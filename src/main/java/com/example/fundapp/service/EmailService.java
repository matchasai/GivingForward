package com.example.fundapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.fundapp.model.Campaign;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.UserRepository;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    public void sendCampaignNotificationToAllUsers(Campaign campaign) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            sendCampaignEmail(user.getEmail(), campaign);
        }
    }

    public void sendCampaignEmail(String to, Campaign campaign) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("New Campaign: " + campaign.getTitle());
        message.setText("Dear supporter,\n\nA new campaign has been launched: " + campaign.getTitle() +
                "\nDescription: " + campaign.getDescription() +
                "\nTarget Amount: $" + campaign.getTargetAmount() +
                "\n\nHelp us reach our goal! Visit the site to contribute.\n\nThank you!");
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request - GivingForward");
        message.setText("Dear User,\n\n" +
                "You have requested to reset your password for GivingForward.\n\n" +
                "Click the following link to reset your password:\n" +
                "http://localhost:5173/reset-password?token=" + token + "\n\n" +
                "This link will expire in 1 hour for security reasons.\n\n" +
                "If you did not request this password reset, please ignore this email.\n\n" +
                "Thank you,\nGivingForward Team");
        mailSender.send(message);
    }
}
