package com.example.fundapp.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.fundapp.dto.ChangePasswordRequest;
import com.example.fundapp.dto.UpdateProfileRequest;
import com.example.fundapp.model.PasswordResetToken;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.PasswordResetTokenRepository;
import com.example.fundapp.repository.UserRepository;

@Service
public class UserAccountService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    public User updateProfile(User user, UpdateProfileRequest request) {
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");

        // Check if email is already taken by another user
        if (!user.getEmail().equals(request.getEmail())) {
            userRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(user.getId())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
                }
            });
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        return userRepository.save(user);
    }

    public void changePassword(User user, ChangePasswordRequest request) {
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Notify user about password change
        notificationService.notifyPasswordChanged(user);
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(Instant.now().plusSeconds(60 * 60)); // 1 hour
        passwordResetTokenRepository.save(token);

        // Send password reset email
        emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
    }

    public void confirmPasswordReset(String tokenValue, String newPassword) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));
        if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expired or used");
        }
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }
}
