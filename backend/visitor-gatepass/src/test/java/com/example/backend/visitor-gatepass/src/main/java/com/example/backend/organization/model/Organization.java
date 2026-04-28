package com.example.backend.organization.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "organization")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String address;
    private String city;
    private String type;
    private String website;
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructor
    public Organization() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

}