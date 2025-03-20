package com.bookshop.config;

import com.bookshop.models.Role;
import com.bookshop.models.User;
import com.bookshop.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@bookshop.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setAddress("Admin Address");
            admin.setRole(Role.ADMIN);
            
            userRepository.save(admin);
            System.out.println("Admin user created successfully!");
        }

        // Create a test user if it doesn't exist
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@bookshop.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFirstName("Regular");
            user.setLastName("User");
            user.setAddress("User Address");
            user.setRole(Role.USER);
            
            userRepository.save(user);
            System.out.println("Test user created successfully!");
        }
    }
} 