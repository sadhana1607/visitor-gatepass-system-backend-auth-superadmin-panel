
package com.example.backend.Org_Req.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

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

    @NotBlank(message = "Type is required")
    private String type;

    @Pattern(
            regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,}$",
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
}