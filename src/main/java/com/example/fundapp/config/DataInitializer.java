package com.example.fundapp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.fundapp.constants.AppConstants;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.UserRepository;

@Component
@Profile({ "dev", "local" })
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByEmail(AppConstants.DEFAULT_ADMIN_EMAIL)) {
            User admin = new User();
            admin.setName(AppConstants.DEFAULT_ADMIN_NAME);
            admin.setEmail(AppConstants.DEFAULT_ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(AppConstants.DEFAULT_ADMIN_PASSWORD));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            if (log.isInfoEnabled())
                log.info("Admin user created: {}", AppConstants.DEFAULT_ADMIN_EMAIL);
        }
    }
}