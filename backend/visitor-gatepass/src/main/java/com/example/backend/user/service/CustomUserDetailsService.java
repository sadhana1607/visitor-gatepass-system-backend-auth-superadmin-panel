package com.example.backend.user.service;

import com.example.backend.user.dto.response.UserResponse;
import com.example.backend.user.model.Role;
import com.example.backend.user.repository.UserRepository;
import com.example.backend.user.model.User;

import org.springframework.beans.factory.annotation.Autowired;
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
}