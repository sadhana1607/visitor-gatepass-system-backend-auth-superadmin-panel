package com.example.backend.Visitor.entity;

import com.example.backend.employee.model.Employee;
import com.example.backend.organization.model.Organization;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "visitor_request")
public class VisitorRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String visitorName;
    private String email;
    private String purpose;

    private LocalDateTime visitDate; // ✅ FIXED (String → DateTime)

    private String otp;
    private String gatePassCode;
    private String status;

    private Boolean securityIncident = false; // ✅ ADD

    private Double stayDuration; // ✅ ADD (for avgStay query)

    private LocalDateTime createdAt; // ✅ ADD (for reports)

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}