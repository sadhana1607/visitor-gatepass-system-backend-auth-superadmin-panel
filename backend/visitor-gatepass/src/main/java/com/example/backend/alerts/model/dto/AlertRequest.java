package com.example.backend.alerts.model.dto;

import com.example.backend.alerts.model.AlertType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AlertRequest {

    @NotBlank(message = "org is required")
    private String org;

    private String orgColor = "#888888";

    @NotNull(message = "type is required (danger | warning | info)")
    private AlertType type;

    private String icon = "🔔";

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "msg is required")
    private String msg;

    private String time;

    private String action = "Auto-generated";
}
