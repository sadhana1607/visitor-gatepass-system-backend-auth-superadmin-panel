package com.example.backend.email.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "emails")
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromEmail;
    private String toEmail;
    private String ownerEmail;   // ✅ who this record belongs to
    private String folder;       // ✅ "inbox" or "sent"
    private String subject;
    private String message;
    private LocalDateTime sentAt;

    @Enumerated(EnumType.STRING)
    private EmailStatus status;

    @PrePersist
    public void prePersist() {
        this.sentAt = LocalDateTime.now();   // ✅ auto timestamp
    }
}