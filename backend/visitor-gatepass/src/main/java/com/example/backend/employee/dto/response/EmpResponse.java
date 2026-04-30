package com.example.backend.employee.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor   // 🔥 required for Jackson
@AllArgsConstructor  // 🔥 optional but useful
public class EmpResponse {

    private Long id;
    private String name;
    private String email;
    private String department;
    private String role;
    private String status;
    private String shiftStart;
    private String shiftEnd;
    private String phone;
    private String message;

    public record UpdateStatusRequest(
            @NotBlank(message = "Status must not be blank")
            String status
    ) {}
}