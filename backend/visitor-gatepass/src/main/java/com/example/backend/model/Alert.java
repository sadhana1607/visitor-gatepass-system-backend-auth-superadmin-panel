package com.security.alerts.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
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
