package com.example.backend.employee.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReportsSummaryResponse {
    private String totalVisitors;
    private String thisMonth;
    private String monthChange;
    private String avgDailyVisits;
    private String securityIncidents;
    private String incidentsSub;
}
