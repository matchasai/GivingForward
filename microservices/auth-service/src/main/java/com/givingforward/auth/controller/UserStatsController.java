package com.givingforward.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.auth.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserStatsController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/count")
    public Long getUserCount() {
        return userRepository.count();
    }
}
