package com.example.backend.gatepass.Repository;

import com.example.backend.gatepass.model.GatePass;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GatePassRepository extends JpaRepository<GatePass, Long> {
    Optional<GatePass> findByOtp(String otp);
}
