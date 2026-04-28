package com.example.backend.user.model;



import com.example.backend.organization.model.Organization;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
    private String status;
    // 🔗 Many Users → One Organization
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    // Getters & Setters
}