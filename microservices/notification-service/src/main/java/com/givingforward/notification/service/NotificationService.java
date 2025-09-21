package com.givingforward.notification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.givingforward.notification.dto.NotificationRequest;

@Service
public class NotificationService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendNotification(NotificationRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getTo());
        message.setSubject(request.getSubject());
        message.setText(request.getMessage());
        mailSender.send(message);
    }
}
