package com.example.backend.employee.service;

import com.example.backend.Visitor.repository.VisitorRequestRepository;
import com.example.backend.employee.dto.response.ReportsSummaryResponse;
import com.example.backend.Visitor.repository.VisitorRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportsService {

    private final VisitorRequestRepository visitorRepository;

    // ── SUMMARY ───────────────────────────────────────────
    public ReportsSummaryResponse getSummary() {

        long total = visitorRepository.count();

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime startOfNext  = startOfMonth.plusMonths(1);

        long thisMonth = visitorRepository.countByVisitDateBetween(startOfMonth, startOfNext);

        long daysElapsed = LocalDate.now().getDayOfMonth();
        long avgDaily    = daysElapsed > 0 ? thisMonth / daysElapsed : 0;

        long incidents = visitorRepository.countBySecurityIncidentTrue();

        return ReportsSummaryResponse.builder()
                .totalVisitors(String.valueOf(total))
                .thisMonth(String.valueOf(thisMonth))
                .monthChange("Live data")
                .avgDailyVisits(String.valueOf(avgDaily))
                .securityIncidents(String.valueOf(incidents))
                .incidentsSub(incidents + " total this month")
                .build();
    }
    // ── VISITOR TREND ─────────────────────────────────────
    public List<Map<String, Object>> getVisitorTrend() {
        List<Map<String, Object>> result = new ArrayList<>();

        // Monthly
        for (Object[] row : visitorRepository.getMonthlyTrend()) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month", row[0]);
            entry.put("count", row[1]);
            result.add(entry);
        }

        // Weekly
        for (Object[] row : visitorRepository.getWeeklyTrend()) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("day",   row[0]);
            entry.put("count", row[1]);
            result.add(entry);
        }

        return result;
    }

    // ── ORG PERFORMANCE ───────────────────────────────────
    public List<Map<String, Object>> getOrgPerformance() {
        // Merge visitors count + avg stay per org
        Map<String, Long>   countMap   = new LinkedHashMap<>();
        Map<String, String> avgStayMap = new LinkedHashMap<>();

        String[] colors = {"#0d6efd","#00c878","#8b5cf6","#f59e0b","#ff3d5a","#00c8e0"};

        for (Object[] row : visitorRepository.countByOrganization()) {
            countMap.put((String) row[0], (Long) row[1]);
        }
        for (Object[] row : visitorRepository.avgStayByOrg()) {
            double mins = row[1] != null ? ((Number) row[1]).doubleValue() : 0;
            long h = (long)(mins / 60);
            long m = (long)(mins % 60);
            avgStayMap.put((String) row[0], h + "h " + String.format("%02d", m) + "m");
        }

        List<Map<String, Object>> result = new ArrayList<>();
        int colorIdx = 0;
        for (Map.Entry<String, Long> e : countMap.entrySet()) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("name",     e.getKey());
            entry.put("visitors", e.getValue());
            entry.put("avgStay",  avgStayMap.getOrDefault(e.getKey(), "N/A"));
            entry.put("color",    colors[colorIdx % colors.length]);
            colorIdx++;
            result.add(entry);
        }
        return result;
    }

    // ── VISITOR TYPES ─────────────────────────────────────
    public List<Map<String, Object>> getVisitorTypes() {
        String[] colors = {"#0d6efd","#00c878","#8b5cf6","#ff3d5a","#f59e0b"};
        List<Map<String, Object>> result = new ArrayList<>();
        int i = 0;
        for (Object[] row : visitorRepository.countByPurpose()) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("type",  row[0]);
            entry.put("count", row[1]);
            entry.put("color", colors[i % colors.length]);
            i++;
            result.add(entry);
        }
        return result;
    }
}