package com.example.backend.gatepass.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class GatePass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String visitorName;
    private String phone;
    private String purpose;

    private String otp;
    private boolean verified;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    // ✅ Overstay
    private LocalDateTime expectedExitTime;

    // ✅ NEW: Validity (1 day)
    private LocalDateTime validFrom;
    private LocalDateTime validTill;

    // Getters & Setters

    public Long getId() { return id; }

    public String getVisitorName() { return visitorName; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public LocalDateTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }

    public LocalDateTime getExitTime() { return exitTime; }
    public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }

    public LocalDateTime getExpectedExitTime() { return expectedExitTime; }
    public void setExpectedExitTime(LocalDateTime expectedExitTime) { this.expectedExitTime = expectedExitTime; }

    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

    public LocalDateTime getValidTill() { return validTill; }
    public void setValidTill(LocalDateTime validTill) { this.validTill = validTill; }
}
