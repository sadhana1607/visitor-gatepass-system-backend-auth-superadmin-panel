package com.example.backend.gatepass.service;

import com.example.backend.config.EmailService;
import com.example.backend.gatepass.model.GatePass;
import com.example.backend.Logs.model.Logs;
import com.example.backend.gatepass.Repository.GatePassRepository;
import com.example.backend.Logs.Repository.LogsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GatePassService {

    @Autowired
    private GatePassRepository repo;

    @Autowired
    private LogsRepository logsRepo;

    @Autowired
    private EmailService emailService;

    // ✅ LOG FUNCTION
    private void log(Long id, String action) {
        Logs log = new Logs();
        log.setUserId(id);
        log.setAction(action);
        logsRepo.save(log);
    }

    // 1. CREATE VISITOR
    public GatePass createVisitor(GatePass gp) {
        String otp = String.valueOf((int)(Math.random() * 9000) + 1000);

        gp.setOtp(otp);
        gp.setVerified(false);

        // Visitor not entered yet
        gp.setEntryTime(null);
        gp.setExitTime(null);
        gp.setExpectedExitTime(null);

        // Validity (testing: 1 min)
        gp.setValidFrom(LocalDateTime.now());
        gp.setValidTill(LocalDateTime.now().plusMinutes(1));

        GatePass saved = repo.save(gp);
        log(saved.getId(), "Visitor Created");
        return saved;
    }

    // 2. VERIFY OTP (ENTRY)
    public GatePass verifyOtp(String otp) {
        GatePass gp = repo.findByOtp(otp).orElse(null);

        if (gp != null) {
            gp.setVerified(true);

            gp.setEntryTime(LocalDateTime.now());

            // Expected exit after 30 min
            gp.setExpectedExitTime(LocalDateTime.now().plusMinutes(30));

            GatePass updated = repo.save(gp);
            log(updated.getId(), "OTP Verified");
            return updated;
        }
        return null;
    }

    // 3. EXIT VISITOR
    public GatePass exitVisitor(Long id) {
        GatePass gp = repo.findById(id).orElse(null);

        if (gp != null) {
            gp.setExitTime(LocalDateTime.now());

            GatePass updated = repo.save(gp);
            log(updated.getId(), "Visitor Exited");
            return updated;
        }
        return null;
    }

    // 4. GET BY ID
    public GatePass getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // ✅ 5. OVERSTAY CHECK (NEW - FIX)
    public boolean isVisitorOverstayed(GatePass gp) {
        return gp.getEntryTime() != null &&
                gp.getExitTime() == null &&
                gp.getExpectedExitTime() != null &&
                LocalDateTime.now().isAfter(gp.getExpectedExitTime());
    }

    // 6. VALIDITY CHECK
    public boolean isValidityExpired(GatePass gp) {
        return gp.getEntryTime() == null &&
                gp.getValidTill() != null &&
                LocalDateTime.now().isAfter(gp.getValidTill());
    }

    // 7. AUTO ALERT SYSTEM
    @Scheduled(fixedRate = 60000)
    public void checkAlerts() {
        List<GatePass> list = repo.findAll();

        for (GatePass gp : list) {

            // 🔴 OVERSTAY ALERT
            if (isVisitorOverstayed(gp)) {
                System.out.println("OVERSTAY ALERT: " + gp.getVisitorName());

                log(gp.getId(), "Overstay");

                emailService.sendEmail(
                        "your_email@gmail.com",
                        "Overstay Alert",
                        "Visitor " + gp.getVisitorName() + " has overstayed."
                );
            }

            // 🔴 MISSED VISIT ALERT
            if (isValidityExpired(gp)) {
                System.out.println("MISSED VISIT ALERT: " + gp.getVisitorName());

                log(gp.getId(), "Missed Visit");

                emailService.sendEmail(
                        "your_email@gmail.com",
                        "Missed Visit Alert",
                        "Visitor " + gp.getVisitorName() + " did not arrive."
                );
            }
        }
    }

    // 8. GET ALL
    public List<GatePass> getAllVisitors() {
        return repo.findAll();
    }

    // 9. COUNT
    public long getVisitorCount() {
        return repo.count();
    }
}
