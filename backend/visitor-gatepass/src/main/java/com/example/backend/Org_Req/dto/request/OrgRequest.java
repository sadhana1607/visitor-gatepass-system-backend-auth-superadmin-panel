package com.example.backend.Org_Req.dto.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class OrgRequest {

    @NotBlank(message = "Organization name is required")
    private String name;

    @NotBlank(message = "Organization email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String type;

    @Pattern(
            regexp = "^(https?://)?(www\\.)?.+\\..+$",
            message = "Invalid website URL"
    )
    private String website;

    @NotBlank(message = "Admin name is required")
    private String adminName;

    @NotBlank(message = "Admin email is required")
    @Email(message = "Invalid admin email format")
    private String adminEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String adminPassword;

    private String status; // optional (can remove if not needed)
}