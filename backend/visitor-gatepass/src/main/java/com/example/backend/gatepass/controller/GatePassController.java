package com.example.backend.gatepass.controller;

import com.example.backend.gatepass.model.GatePass;
import com.example.backend.gatepass.service.GatePassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GatePassController {

    @Autowired
    private GatePassService service;

    // TEST API
    @GetMapping("/test")
    public String test() {
        return "API Working";
    }

    // 1. CREATE VISITOR
    @PostMapping("/visitor")
    public ResponseEntity<GatePass> createVisitor(@RequestBody GatePass gp) {
        return ResponseEntity.ok(service.createVisitor(gp));
    }

    // 2. VERIFY OTP
    @PostMapping("/visitor/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody GatePass request) {

        GatePass result = service.verifyOtp(request.getOtp());

        if (result == null) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        return ResponseEntity.ok(result);
    }

    // 3. EXIT VISITOR
    @PutMapping("/visitor/exit/{id}")
    public ResponseEntity<?> exitVisitor(@PathVariable Long id) {

        GatePass result = service.exitVisitor(id);

        if (result == null) {
            return ResponseEntity.badRequest().body("Visitor not found");
        }

        return ResponseEntity.ok(result);
    }

    // 4. CHECK OVERSTAY
    @GetMapping("/check/{id}")
    public ResponseEntity<String> checkVisitor(@PathVariable Long id) {

        GatePass gp = service.getById(id);

        if (gp == null)
            return ResponseEntity.badRequest().body("Visitor not found");

        if (service.isVisitorOverstayed(gp)) {
            return ResponseEntity.ok("Visitor overstayed!");
        }

        return ResponseEntity.ok("Within allowed time");
    }

    // 5. CHECK VALIDITY
    @GetMapping("/validity/{id}")
    public ResponseEntity<String> checkValidity(@PathVariable Long id) {

        GatePass gp = service.getById(id);

        if (gp == null)
            return ResponseEntity.badRequest().body("Visitor not found");

        if (service.isValidityExpired(gp)) {
            return ResponseEntity.ok("Validity expired (visitor did not arrive)");
        }

        return ResponseEntity.ok("Validity active");
    }

    // 6. GET ALL VISITORS
    @GetMapping("/all")
    public ResponseEntity<List<GatePass>> getAll() {
        return ResponseEntity.ok(service.getAllVisitors());
    }

    // 7. COUNT VISITORS
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(service.getVisitorCount());
    }
}
