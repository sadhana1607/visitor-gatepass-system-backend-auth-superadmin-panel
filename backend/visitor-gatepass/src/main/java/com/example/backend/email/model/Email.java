package com.example.backend.email.model;
import com.example.backend.user.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String toEmail;
    private String fromEmail;
    private String subject;
    private String message;

    private LocalDateTime sentAt;
    @Enumerated(EnumType.STRING)
    private EmailStatus status;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;   // receiver or owner
}