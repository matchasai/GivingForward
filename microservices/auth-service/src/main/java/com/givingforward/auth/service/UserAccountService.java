package com.givingforward.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.givingforward.auth.dto.ChangePasswordRequest;
import com.givingforward.auth.model.User;
import com.givingforward.auth.repository.UserRepository;

@Service
public class UserAccountService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public void changePassword(User user, ChangePasswordRequest request) {
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // For now, just send an email with a simple reset link
        // In production, you'd generate a secure token and store it
        emailService.sendPasswordResetEmail(user.getEmail(), "temp-token");
    }

    public void confirmPasswordReset(String token, String newPassword) {
        // In production, you'd look up the token and validate it
        // For now, just find the user by email (token is email for demo)
        User user = userRepository.findByEmail(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}