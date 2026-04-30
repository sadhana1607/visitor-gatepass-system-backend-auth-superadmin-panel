package com.example.backend.email.repository;

import com.example.backend.email.model.Email;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmailRepository extends JpaRepository<Email, Long> {
    List<Email> findByToEmail(String toEmail);
}