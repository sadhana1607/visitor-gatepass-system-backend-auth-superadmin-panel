package com.example.backend.alerts.controller;

import com.example.backend.alerts.model.dto.AlertRequest;
import com.example.backend.alerts.model.dto.AlertResponse;
import com.example.backend.alerts.model.dto.AlertStatsResponse;
import com.example.backend.alerts.model.dto.ApiResponse;
import com.example.backend.alerts.model.AlertStatus;
import com.example.backend.alerts.model.AlertType;
import com.example.backend.alerts.model.dto.*;
import com.example.backend.alerts.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    // GET /api/alerts?org=&type=&status=
    @GetMapping("/all_alerts")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAll(
        @RequestParam(required = false) String org,
        @RequestParam(required = false) AlertType type,
        @RequestParam(required = false) AlertStatus status
    ) {
        List<AlertResponse> data = alertService.getAll(org, type, status);
        return ResponseEntity.ok(ApiResponse.ok(data, data.size()));
    }

    // GET /api/alerts/stats
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AlertStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getStats()));
    }

    // GET /api/alerts/orgs
    @GetMapping("/orgs")
    public ResponseEntity<ApiResponse<List<String>>> getOrgs() {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getOrgs()));
    }

    // GET /api/alerts/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlertResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getById(id)));
    }

    // POST /api/alerts
    @PostMapping
    public ResponseEntity<ApiResponse<AlertResponse>> create(
        @RequestBody @Valid AlertRequest request
    ) {
        AlertResponse created = alertService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Alert created", created));
    }

    // PATCH /api/alerts/{id}/acknowledge
    @PatchMapping("/{id}/acknowledge")
    public ResponseEntity<ApiResponse<AlertResponse>> acknowledge(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Alert acknowledged", alertService.acknowledge(id)));
    }

    // PATCH /api/alerts/{id}/resolve
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<AlertResponse>> resolve(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Alert resolved", alertService.resolve(id)));
    }

    // PATCH /api/alerts/{id}/escalate
    @PatchMapping("/{id}/escalate")
    public ResponseEntity<ApiResponse<AlertResponse>> escalate(
        @PathVariable String id,
        @RequestBody(required = false) Map<String, String> body
    ) {
        String action = body != null ? body.get("action") : null;
        return ResponseEntity.ok(ApiResponse.ok("Alert escalated", alertService.escalate(id, action)));
    }

    // DELETE /api/alerts/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        alertService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Alert deleted", null));
    }
}
