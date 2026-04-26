package com.example.backend.employee.model;

import com.example.backend.organization.model.Organization;
import com.example.backend.user.model.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Name required
    @NotBlank(message = "Employee name is required")
    private String name;

    // ✅ Department required
    @NotBlank(message = "Department is required")
    private String department;

    // ✅ Email validation
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    // ✅ Shift start required
    @NotNull(message = "Shift start time is required")
    private LocalTime shiftStart;

    // ✅ Shift end required
    @NotNull(message = "Shift end time is required")
    private LocalTime shiftEnd;

    // ✅ Status required
    @NotBlank(message = "Status is required (ACTIVE / INACTIVE)")
    private String status;

    // ✅ Phone validation (10 digits)
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    // ✅ Designation required
    @NotBlank(message = "Designation is required")
    private String designation;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 🔗 Many Employees → One Organization
    @NotNull(message = "Organization is required")
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    // 🔗 One Employee → One User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}