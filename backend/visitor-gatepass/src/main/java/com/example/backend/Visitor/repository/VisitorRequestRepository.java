package com.example.backend.Visitor.repository;

import com.example.backend.Visitor.entity.VisitorRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitorRequestRepository extends JpaRepository<VisitorRequest, Long> {

    List<VisitorRequest> findByEmployeeId(Long employeeId);

    List<VisitorRequest> findByEmail(String email);

    List<VisitorRequest> findByStatus(String status);

    long countByVisitDateBetween(LocalDateTime start, LocalDateTime end);

    long countBySecurityIncidentTrue();
    @Query("SELECT FUNCTION('MONTH', v.createdAt), COUNT(v) FROM VisitorRequest v GROUP BY FUNCTION('MONTH', v.createdAt)")
    List<Object[]> getMonthlyTrend();

    @Query("SELECT FUNCTION('WEEK', v.createdAt), COUNT(v) FROM VisitorRequest v GROUP BY FUNCTION('WEEK', v.createdAt)")
    List<Object[]> getWeeklyTrend();

    @Query("SELECT v.organization.name, COUNT(v) FROM VisitorRequest v GROUP BY v.organization.name")
    List<Object[]> countByOrganization();

    @Query("SELECT v.organization.name, AVG(v.stayDuration) FROM VisitorRequest v GROUP BY v.organization.name")
    List<Object[]> avgStayByOrg();

    @Query("SELECT v.purpose, COUNT(v) FROM VisitorRequest v GROUP BY v.purpose")
    List<Object[]> countByPurpose();

    @Query("SELECT FUNCTION('WEEK', v.createdAt), COUNT(v) FROM VisitorRequest v GROUP BY FUNCTION('WEEK', v.createdAt) ORDER BY FUNCTION('WEEK', v.createdAt)")
    List<Object[]> countByMonth();
}