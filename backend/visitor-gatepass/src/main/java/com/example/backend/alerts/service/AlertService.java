package com.example.backend.alerts.service;

import com.example.backend.exception.AlertNotFoundException;
import com.example.backend.alerts.model.Alert;
import com.example.backend.alerts.model.AlertStatus;
import com.example.backend.alerts.model.AlertType;
import com.example.backend.alerts.model.dto.*;
import com.example.backend.alerts.repository.AlertRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository repo;
    private final SimpMessagingTemplate broker;

    // ── Queries ─────────────────────────────────────

    public List<AlertResponse> getAll(String org, AlertType type, AlertStatus status) {
        return repo.findAll(org, type, status)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AlertResponse getById(String id) {
        return toResponse(findOrThrow(id));
    }

    public List<String> getOrgs() {
        return repo.findDistinctOrgs();
    }

    public AlertStatsResponse getStats() {
        List<Alert> all = repo.findAll(null, null, null);

        return AlertStatsResponse.builder()
                .total(all.size())

                .open((int) all.stream()
                        .filter(a -> a.getStatus() == AlertStatus.OPEN).count())

                .acknowledged((int) all.stream()
                        .filter(a -> a.getStatus() == AlertStatus.ACKNOWLEDGED).count())

                .escalated((int) all.stream()
                        .filter(a -> a.getStatus() == AlertStatus.ESCALATED).count())

                .resolved((int) all.stream()
                        .filter(a -> a.getStatus() == AlertStatus.RESOLVED).count())

                .critical((int) all.stream()
                        .filter(a -> a.getType() == AlertType.DANGER).count())

                .warning((int) all.stream()
                        .filter(a -> a.getType() == AlertType.WARNING).count())

                .info((int) all.stream()
                        .filter(a -> a.getType() == AlertType.INFO).count())

                .byOrg(repo.findDistinctOrgs().stream().map(org -> {
                    List<Alert> orgAlerts = all.stream()
                            .filter(a -> a.getOrg().equals(org))
                            .collect(Collectors.toList());

                    return AlertStatsResponse.OrgStat.builder()
                            .org(org)
                            .orgColor(orgAlerts.isEmpty() ? "#888" : orgAlerts.get(0).getOrgColor())
                            .total(orgAlerts.size())
                            .open((int) orgAlerts.stream()
                                    .filter(a -> a.getStatus() == AlertStatus.OPEN).count())
                            .critical((int) orgAlerts.stream()
                                    .filter(a -> a.getType() == AlertType.DANGER).count())
                            .build();

                }).collect(Collectors.toList()))

                .build();
    }

    // ── Mutations ─────────────────────────────────────

    public AlertResponse create(AlertRequest req) {

        Alert alert = Alert.builder()
                .org(req.getOrg())
                .orgColor(req.getOrgColor())
                .type(req.getType())
                .icon(req.getIcon())
                .title(req.getTitle())
                .msg(req.getMsg())
                .time(req.getTime())
                .status(AlertStatus.OPEN)
                .action(req.getAction())
                .build();

        Alert saved = repo.save(alert);

        AlertResponse response = toResponse(saved);

        // 🔥 WebSocket push
        broker.convertAndSend("/topic/alerts/new", response);

        return response;
    }

    public AlertResponse acknowledge(String id) {
        return updateStatus(id, AlertStatus.ACKNOWLEDGED, "Host Contacted");
    }

    public AlertResponse resolve(String id) {
        return updateStatus(id, AlertStatus.RESOLVED, "Resolved & Logged");
    }

    public AlertResponse escalate(String id, String action) {
        return updateStatus(id,
                AlertStatus.ESCALATED,
                (action != null && !action.isBlank())
                        ? action
                        : "Escalated to Authority"
        );
    }

    public void delete(String id) {
        findOrThrow(id);
        repo.deleteById(id);
        broker.convertAndSend("/topic/alerts/deleted", id);
    }

    // ── SLA Auto Escalation ───────────────────────────

    public void runSlaEscalation(int timeoutMinutes) {

        LocalDateTime threshold = LocalDateTime.now().minusMinutes(timeoutMinutes);

        repo.findByStatusAndCreatedAtBefore(AlertStatus.OPEN, threshold)
                .forEach(alert -> {

                    alert.setStatus(AlertStatus.ESCALATED);
                    alert.setAction("Auto-Escalated (SLA)");
                    alert.setUpdatedAt(LocalDateTime.now());

                    repo.save(alert);

                    broker.convertAndSend("/topic/alerts/sla", toResponse(alert));

                    System.out.println("⚠️ SLA auto-escalated: " + alert.getId());
                });
    }

    // ── Helpers ─────────────────────────────────────

    private AlertResponse updateStatus(String id, AlertStatus status, String action) {

        Alert alert = findOrThrow(id);

        alert.setStatus(status);
        alert.setAction(action);
        alert.setUpdatedAt(LocalDateTime.now());

        repo.save(alert);

        AlertResponse response = toResponse(alert);

        broker.convertAndSend("/topic/alerts/updated", response);

        return response;
    }

    private Alert findOrThrow(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new AlertNotFoundException("Alert not found: " + id));
    }

    private AlertResponse toResponse(Alert a) {
        return AlertResponse.builder()
                .id(a.getId())
                .org(a.getOrg())
                .orgColor(a.getOrgColor())
                .type(a.getType())
                .icon(a.getIcon())
                .title(a.getTitle())
                .msg(a.getMsg())
                .time(a.getTime())
                .status(a.getStatus())
                .action(a.getAction())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}