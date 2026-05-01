package com.example.backend.alerts.schedular;

import com.example.backend.alerts.service.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@EnableScheduling
@RequiredArgsConstructor
public class SlaSchedulerService {

    private final AlertService alertService;

    // Configurable via application.properties:
    //   alerts.sla.timeout-minutes=30
    //   alerts.sla.check-interval-ms=60000
    @Value("${alerts.sla.timeout-minutes:30}")
    private int timeoutMinutes;

    @Scheduled(fixedRateString = "${alerts.sla.check-interval-ms:60000}")
    public void checkSlaBreaches() {
        log.info("[SLA] Running escalation check at {} — threshold: {} min",
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")),
                timeoutMinutes);

        try {
            alertService.runSlaEscalation(timeoutMinutes);
            log.info("[SLA] Escalation check complete.");
        } catch (Exception ex) {
            log.error("[SLA] Escalation check failed: {}", ex.getMessage(), ex);
        }
    }
}
