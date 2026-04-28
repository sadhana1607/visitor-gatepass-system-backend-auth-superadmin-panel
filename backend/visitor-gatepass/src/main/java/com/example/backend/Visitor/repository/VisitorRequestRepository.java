package com.example.backend.Visitor.repository;

import com.example.backend.Visitor.entity.VisitorRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitorRequestRepository extends JpaRepository<VisitorRequest, Long> {

    // Employee wise visitors
    List<VisitorRequest> findByEmployeeId(Long employeeId);

    // ✅ FIX: multiple records handle karega
    List<VisitorRequest> findByEmail(String email);

    // Status wise
    List<VisitorRequest> findByStatus(String status);
}