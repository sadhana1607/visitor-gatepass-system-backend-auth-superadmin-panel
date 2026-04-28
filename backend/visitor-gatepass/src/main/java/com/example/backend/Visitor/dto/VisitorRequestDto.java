package com.example.backend.Visitor.dto;

import lombok.Data;

@Data
public class VisitorRequestDto {
    private String visitorName;
    private String email;
    private String purpose;
    private String visitDate;
    private Long employeeId;
}