package com.example.backend.auth.controller;
import com.example.backend.auth.dto.request.AuthRequest;
import com.example.backend.auth.dto.response.AuthResponse;
import com.example.backend.auth.service.AuthService;
import com.example.backend.auth.service.TokenBlacklistService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private TokenBlacklistService blacklistService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest req) {
        return service.login(req.email, req.password);
    }

    // ✅ LOGOUT
    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            blacklistService.blacklistToken(token);
        }

        return "Logged out successfully";
    }
}
