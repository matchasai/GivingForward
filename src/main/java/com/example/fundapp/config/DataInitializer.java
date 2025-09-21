package com.example.fundapp.config;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.fundapp.model.Campaign;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.CampaignRepository;
import com.example.fundapp.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@fundapp.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@fundapp.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user created: admin@fundapp.com / admin123");
        }

        // Create sample user if it doesn't exist
        if (!userRepository.existsByEmail("user@fundapp.com")) {
            User user = new User();
            user.setName("Sample User");
            user.setEmail("user@fundapp.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(User.Role.USER);
            userRepository.save(user);
            System.out.println("Sample user created: user@fundapp.com / user123");
        }

        // Create sample campaigns if none exist
        if (campaignRepository.count() == 0) {
            User admin = userRepository.findByEmail("admin@fundapp.com").orElse(null);

            if (admin != null) {
                // Sample campaign 1
                Campaign campaign1 = new Campaign();
                campaign1.setTitle("Help Build a School");
                campaign1.setDescription(
                        "We're raising funds to build a new school in rural areas. This will provide education to over 200 children who currently have no access to proper schooling facilities.");
                campaign1.setTargetAmount(new BigDecimal("50000"));
                campaign1.setCurrentAmount(new BigDecimal("15000"));
                campaign1.setImageUrl("https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800");
                campaign1.setCreatedBy(admin);
                campaign1.setActive(true);
                campaignRepository.save(campaign1);

                // Sample campaign 2
                Campaign campaign2 = new Campaign();
                campaign2.setTitle("Medical Equipment for Hospital");
                campaign2.setDescription(
                        "Help us purchase essential medical equipment for the local hospital. This includes ventilators, monitors, and other critical care equipment.");
                campaign2.setTargetAmount(new BigDecimal("75000"));
                campaign2.setCurrentAmount(new BigDecimal("25000"));
                campaign2.setImageUrl("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800");
                campaign2.setCreatedBy(admin);
                campaign2.setActive(true);
                campaignRepository.save(campaign2);

                // Sample campaign 3
                Campaign campaign3 = new Campaign();
                campaign3.setTitle("Clean Water Project");
                campaign3.setDescription(
                        "Providing clean drinking water to communities in need. This project will install water purification systems in 10 villages.");
                campaign3.setTargetAmount(new BigDecimal("30000"));
                campaign3.setCurrentAmount(new BigDecimal("8000"));
                campaign3.setImageUrl("https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800");
                campaign3.setCreatedBy(admin);
                campaign3.setActive(true);
                campaignRepository.save(campaign3);

                System.out.println("Sample campaigns created successfully");
            }
        }
    }
}