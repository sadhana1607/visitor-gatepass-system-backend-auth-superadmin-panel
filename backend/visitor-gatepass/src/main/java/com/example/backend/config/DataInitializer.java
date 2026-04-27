package com.example.backend.config;

import com.example.backend.user.model.*;
import com.example.backend.user.model.Role;
import com.example.backend.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository repo, BCryptPasswordEncoder encoder) {
        return args -> {
            if (repo.findByEmail("admin@gmail.com").isPresent()) {
                return;
            }

            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole(Role.SUPER_ADMIN);
            admin.setStatus("ACTIVE");

            repo.save(admin);

            System.out.println("SUPERADMIN CREATED"); // no password printed
        };
    }
}