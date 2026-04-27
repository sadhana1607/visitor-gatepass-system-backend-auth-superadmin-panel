package com.example.backend.auth.service;

import com.example.backend.auth.dto.response.AuthResponse;
import com.example.backend.config.JwtUtil;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.user.model.User;
import com.example.backend.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder encoder;

    // ✅ LOGIN METHOD
    public AuthResponse login(String email, String password) {

        // 🔍 Find user
        User user = repo.findByEmail(email)
                .orElseThrow(() ->
                        new UnauthorizedException("Invalid email or password")
                );


        // 🔐 Password check (IMPORTANT FIX)
        if (!encoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }

        // 🔥 Generate JWT token
        String token = jwtUtil.generateToken(email);

        // 🔥 Get role
        String role = user.getRole().name();

        // ✅ Return response
        return new AuthResponse(token, role);
    }
}