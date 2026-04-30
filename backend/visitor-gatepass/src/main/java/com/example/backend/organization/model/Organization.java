package com.example.backend.organization.model;

import com.example.backend.user.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(
        name = "organization",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        }
)
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "City is required")
    @Column(nullable = false)
    private String city;

    @NotBlank(message = "Type is required")
    @Column(nullable = false)
    private String type;

    @Pattern(
            regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,}$",
            message = "Invalid website URL"
    )
    private String website;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

private String phone;
    // Constructor
    public Organization() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }
}