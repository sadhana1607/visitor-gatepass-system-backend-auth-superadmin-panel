package com.example.backend.Visitor.entity;

import com.example.backend.employee.model.Employee;
import jakarta.persistence.*;
import lombok.Data;

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
    private String visitDate;

    private String otp;
    private String gatePassCode;
    private String status;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}

