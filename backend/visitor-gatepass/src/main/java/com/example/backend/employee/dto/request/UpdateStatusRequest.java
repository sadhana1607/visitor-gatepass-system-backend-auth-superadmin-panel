package com.example.backend.employee.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateStatusRequest(
        @NotBlank(message = "Status must not be blank")
        String status
) {}