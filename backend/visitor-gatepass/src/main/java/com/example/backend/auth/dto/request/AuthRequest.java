package com.example.backend.auth.dto.request;


import lombok.Data;

@Data
public class AuthRequest {
    public String email;
    public String password;
}
