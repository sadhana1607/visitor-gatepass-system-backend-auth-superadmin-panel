package com.example.backend.config;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;


import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey";

    public Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(getKey())
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


}