package com.givingforward.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

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