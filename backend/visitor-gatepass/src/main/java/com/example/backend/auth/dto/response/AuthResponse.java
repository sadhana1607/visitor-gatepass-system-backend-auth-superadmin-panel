package com.example.backend.auth.dto.response;

import lombok.Data;

@Data
public class AuthResponse {
    public String token;
    public String role;

    public AuthResponse(String token,String role) {
        this.token = token;
        this.role = role;
    }
}