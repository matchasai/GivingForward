package com.givingforward.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.auth.dto.ChangePasswordRequest;
import com.givingforward.auth.dto.PasswordResetRequest;
import com.givingforward.auth.model.User;
import com.givingforward.auth.service.UserAccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/account")
public class UserAccountController {

    @Autowired
    private UserAccountService userAccountService;

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        userAccountService.changePassword(user, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<Void> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        userAccountService.initiatePasswordReset(request.getEmail());
        return ResponseEntity.noContent().build();
    }

    public static class PasswordResetConfirm {
        public String token;
        public String newPassword;
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<Void> confirmPasswordReset(@RequestBody PasswordResetConfirm body) {
        userAccountService.confirmPasswordReset(body.token, body.newPassword);
        return ResponseEntity.noContent().build();
    }
}