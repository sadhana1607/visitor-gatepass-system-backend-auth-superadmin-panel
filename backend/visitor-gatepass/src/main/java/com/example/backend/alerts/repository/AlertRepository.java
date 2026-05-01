package com.example.backend.alerts.repository;

import com.example.backend.alerts.model.Alert;
import com.example.backend.alerts.model.AlertStatus;
import com.example.backend.alerts.model.AlertType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {

    // ✅ Filter query
    @Query("""
        SELECT a FROM Alert a
        WHERE (:org IS NULL OR a.org = :org)
        AND (:type IS NULL OR a.type = :type)
        AND (:status IS NULL OR a.status = :status)
        ORDER BY a.createdAt DESC
    """)
    List<Alert> findAll(String org, AlertType type, AlertStatus status);

    // ✅ Distinct orgs
    @Query("SELECT DISTINCT a.org FROM Alert a")
    List<String> findDistinctOrgs();

    // ✅ SLA logic
    List<Alert> findByStatusAndCreatedAtBefore(AlertStatus status, LocalDateTime time);

}