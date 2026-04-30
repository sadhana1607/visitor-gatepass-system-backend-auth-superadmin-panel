package com.example.backend.user.controller;

import com.example.backend.user.dto.response.UserResponse;
import com.example.backend.user.model.Role;
import com.example.backend.user.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.backend.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private CustomUserDetailsService userService;

    // 🔥 GET USERS BY ROLE
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(
            @PathVariable Role role) {

        return ResponseEntity.ok(userService.getUsersByRole(role));
    }


    // ✅ GET LOGGED-IN USER (FROM JWT)
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUser(authentication));
    }
}
