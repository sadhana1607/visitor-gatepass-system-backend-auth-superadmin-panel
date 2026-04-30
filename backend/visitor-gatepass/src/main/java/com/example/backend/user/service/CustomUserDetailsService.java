package com.example.backend.user.service;

import com.example.backend.user.dto.response.UserResponse;
import com.example.backend.user.model.Role;
import com.example.backend.user.repository.UserRepository;
import com.example.backend.user.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 👇 explicitly use Spring Security User
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    // ✅ This now correctly uses your ENTITY User
    public List<UserResponse> getUsersByRole(Role role) {

        List<User> users = repo.findByRole(role);

        return users.stream().map(u -> new UserResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getStatus(),
                u.getOrganization() != null
                        ? u.getOrganization().getName()
                        : "No Organization"
        )).toList();
    }

    @Autowired
    private UserRepository userRepository;

    // ✅ GET CURRENT USER FROM DB
    public UserResponse getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return mapToResponse(user);
    }

    // ✅ MAPPER → YOUR DTO
    private UserResponse mapToResponse(User user) {

        String orgName = null;

        if (user.getOrganization() != null) {
            orgName = user.getOrganization().getName();
        }

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getStatus(),
                orgName
        );
    }
}