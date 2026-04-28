package com.example.backend.organization.repository;

import com.example.backend.organization.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    boolean existsByEmail(String email);
}