package com.example.backend.config;

import com.example.backend.filter.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class Config {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/org-req/create").permitAll()
                        .requestMatchers("/api/users/me").authenticated()
                        .requestMatchers("/api/email/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/users/**").hasAnyRole("SUPER_ADMIN", "ORG_ADMIN")
                        .requestMatchers("/api/org/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/employee/**").hasAnyRole("SUPER_ADMIN", "ORG_ADMIN")
                        .requestMatchers("/api/visitor/**").hasRole("EMPLOYEE")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}