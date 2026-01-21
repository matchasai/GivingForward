package com.example.fundapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendVerificationEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Email Verification - GivingForward");
        message.setText("Dear User,\n\n" +
                "Thank you for registering with GivingForward!\n\n" +
                "Please verify your email address by clicking the link below:\n" +
                frontendUrl + "/verify-email?token=" + token + "\n\n" +
                "If you did not create this account, please ignore this email.\n\n" +
                "Thank you,\nGivingForward Team");
        mailSender.send(message);
    }

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
                "\nTarget Reached: $" + campaign.getCurrentAmount() +
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
                frontendUrl + "/reset-password?token=" + token + "\n\n" +
                "This link will expire in 1 hour for security reasons.\n\n" +
                "If you did not request this password reset, please ignore this email.\n\n" +
                "Thank you,\nGivingForward Team");
        mailSender.send(message);
    }
}
