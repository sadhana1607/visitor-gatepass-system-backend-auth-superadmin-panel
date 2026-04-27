package com.example.backend.employee.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EmpRequest {

        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
        private String phone;

        @NotBlank(message = "Designation is required")
        private String designation;

        @NotBlank(message = "Department is required")
        private String department;

        @NotBlank(message = "Role is required")
        private String role;

        private String status; // optional (can be set in backend)


        private String shiftStart;


        private String shiftEnd;
}