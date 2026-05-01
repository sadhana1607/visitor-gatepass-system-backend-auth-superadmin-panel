package com.security.alerts.model.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AlertStatsResponse {

    private int total;
    private int open;
    private int acknowledged;
    private int escalated;
    private int resolved;
    private int critical;
    private int warning;
    private int info;
    private List<OrgStat> byOrg;

    @Data
    @Builder
    public static class OrgStat {
        private String org;
        private String orgColor;
        private int total;
        private int open;
        private int critical;
    }
}
