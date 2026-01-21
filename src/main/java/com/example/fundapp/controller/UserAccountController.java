package com.example.fundapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fundapp.dto.ChangePasswordRequest;
import com.example.fundapp.dto.PasswordResetRequest;
import com.example.fundapp.dto.UpdateProfileRequest;
import com.example.fundapp.dto.UserDto;
import com.example.fundapp.model.User;
import com.example.fundapp.service.UserAccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/account")
public class UserAccountController {

    @Autowired
    private UserAccountService userAccountService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal User user) {
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getCreatedAt());
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        User updatedUser = userAccountService.updateProfile(user, request);
        UserDto userDto = new UserDto(updatedUser.getId(), updatedUser.getName(), updatedUser.getEmail(), updatedUser.getRole().name(), updatedUser.getCreatedAt());
        return ResponseEntity.ok(userDto);
    }

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
