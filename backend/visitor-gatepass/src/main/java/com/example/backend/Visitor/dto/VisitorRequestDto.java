package com.example.backend.Visitor.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VisitorRequestDto {
    private String visitorName;
    private String email;
    private String purpose;
    private LocalDateTime visitDate;
    private Long employeeId;
}