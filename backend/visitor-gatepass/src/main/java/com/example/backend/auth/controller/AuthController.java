package com.example.backend.auth.controller;

import com.example.backend.auth.dto.request.AuthRequest;
import com.example.backend.auth.dto.response.AuthResponse;
import com.example.backend.auth.service.AuthService;
import com.example.backend.auth.service.TokenBlacklistService;
import com.example.backend.exception.UnauthorizedException;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private TokenBlacklistService blacklistService;

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(service.login(req.email, req.password));
    }

    // ✅ LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {

        String header = request.getHeader("Authorization");

        // 🔴 Token missing
        if (header == null || !header.startsWith("Bearer ")) {
            throw new UnauthorizedException("Token is missing or invalid !!!");
        }

        String token = header.substring(7);

        // 🔴 Already logged out
        if (blacklistService.isBlacklisted(token)) {
            throw new UnauthorizedException("User already logged out");
        }

        // ✅ Add to blacklist
        blacklistService.blacklistToken(token);

        return ResponseEntity.ok("Logged out successfully");
    }
}

