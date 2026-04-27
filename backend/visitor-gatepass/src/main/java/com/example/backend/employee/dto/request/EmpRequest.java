package com.example.backend.employee.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EmpRequest {

        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Department is required")
        private String department;

        @NotBlank(message = "Role is required")
        private String role;

        private String status;

        // 🔥 ADD THIS (FIX)
        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
        private String phone;

        // 🔥 ADD THIS (FIX)
        @NotBlank(message = "Designation is required")
        private String designation;

        // 🔥 SHIFT
        @NotBlank(message = "Shift start required")
        private String shiftStart;

        @NotBlank(message = "Shift end required")
        private String shiftEnd;
}