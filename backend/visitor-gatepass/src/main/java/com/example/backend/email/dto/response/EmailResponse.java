package com.example.backend.email.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EmailResponse {

    private Long id;

    private String fromEmail;
    private String toEmail;

    private String subject;
    private String message;

    private LocalDateTime sentAt;
}