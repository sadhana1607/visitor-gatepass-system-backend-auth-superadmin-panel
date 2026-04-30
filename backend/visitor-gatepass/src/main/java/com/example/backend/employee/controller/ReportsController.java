package com.example.backend.employee.controller;

import com.example.backend.employee.dto.response.EmpResponse;
import com.example.backend.employee.dto.response.ReportsSummaryResponse;
import com.example.backend.employee.service.ReportsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final ReportsService reportsService;

    // GET /api/reports/summary
    @GetMapping("/summary")
    public ResponseEntity<ReportsSummaryResponse> getSummary() {
        return ResponseEntity.ok(reportsService.getSummary());
    }

    // GET /api/reports/visitor-trend
    // Returns: [{ month, count }] for monthly, [{ day, count }] for weekly
    @GetMapping("/visitor-trend")
    public ResponseEntity<List<Map<String, Object>>> getVisitorTrend() {
        return ResponseEntity.ok(reportsService.getVisitorTrend());
    }

    // GET /api/reports/org-performance
    @GetMapping("/org-performance")
    public ResponseEntity<List<Map<String, Object>>> getOrgPerformance() {
        return ResponseEntity.ok(reportsService.getOrgPerformance());
    }

    // GET /api/reports/visitor-types
    @GetMapping("/visitor-types")
    public ResponseEntity<List<Map<String, Object>>> getVisitorTypes() {
        return ResponseEntity.ok(reportsService.getVisitorTypes());
    }
}
