package com.example.backend.alerts.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // 🔥 UI + Message
    @Column(columnDefinition = "TEXT")
    private String msg;

    private String title;

    // 🔥 Organization
    private String org;
    private String orgColor;

    // 🔥 Enums
    @Enumerated(EnumType.STRING)
    private AlertType type;

    @Enumerated(EnumType.STRING)
    private AlertStatus status;

    // 🔥 Extra fields used in Service
    private String icon;
    private String action;
    private String time;

    private String createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ Auto timestamps
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = AlertStatus.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}