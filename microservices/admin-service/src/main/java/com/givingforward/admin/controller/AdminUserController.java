package com.givingforward.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.givingforward.admin.dto.AdminUserRequest;
import com.givingforward.admin.model.AdminUser;
import com.givingforward.admin.service.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    @Autowired
    private AdminUserService adminUserService;

    @PostMapping
    public AdminUser createAdminUser(@RequestBody AdminUserRequest request) {
        return adminUserService.createAdminUser(request);
    }

    @GetMapping
    public List<AdminUser> getAllAdminUsers() {
        return adminUserService.getAllAdminUsers();
    }

    @GetMapping("/{username}")
    public AdminUser getAdminUserByUsername(@PathVariable String username) {
        return adminUserService.getAdminUserByUsername(username);
    }
}
