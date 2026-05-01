package com.security.alerts.model.dto;

import com.security.alerts.model.AlertStatus;
import com.security.alerts.model.AlertType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AlertResponse {
    private String id;
    private String org;
    private String orgColor;
    private AlertType type;
    private String icon;
    private String title;
    private String msg;
    private String time;
    private AlertStatus status;
    private String action;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
