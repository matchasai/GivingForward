package com.givingforward.admin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.givingforward.admin.dto.AdminUserRequest;
import com.givingforward.admin.model.AdminUser;
import com.givingforward.admin.repository.AdminUserRepository;

@Service
public class AdminUserService {
    @Autowired
    private AdminUserRepository adminUserRepository;

    public AdminUser createAdminUser(AdminUserRequest request) {
        AdminUser user = new AdminUser();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return adminUserRepository.save(user);
    }

    public List<AdminUser> getAllAdminUsers() {
        return adminUserRepository.findAll();
    }

    public AdminUser getAdminUserByUsername(String username) {
        return adminUserRepository.findByUsername(username);
    }
}
