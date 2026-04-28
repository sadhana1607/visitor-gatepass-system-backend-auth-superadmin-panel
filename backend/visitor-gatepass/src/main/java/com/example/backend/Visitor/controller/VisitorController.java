package com.example.backend.Visitor.controller;

import com.example.backend.Visitor.dto.VisitorRequestDto;
import com.example.backend.Visitor.entity.VisitorRequest;
import com.example.backend.Visitor.service.VisitorRequestService;
import com.example.backend.payload.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/visitor")
public class VisitorController {

    @Autowired
    private VisitorRequestService service;

    // 1. ADD
    @PostMapping("/add")
    public ApiResponse add(@RequestBody VisitorRequestDto dto) {
        return service.createRequest(dto);
    }

    // 2. GET ALL
    @GetMapping("/all")
    public List<VisitorRequest> getAll() {
        return service.getAllVisitors();
    }

    // 3. GET BY EMAIL
    @GetMapping("/by-email")
    public List<VisitorRequest> getByEmail(@RequestParam String email) {
        return service.getByEmail(email);
    }

    // 4. VERIFY OTP
    @PostMapping("/verify-otp")
    public ApiResponse verifyOtp(@RequestParam String email,
                                 @RequestParam String otp) {
        return service.verifyOtp(email, otp);
    }

    // 5. RESEND OTP
    @PostMapping("/resend-otp")
    public ApiResponse resendOtp(@RequestParam String email) {
        return service.resendOtp(email);
    }

    // 6. DELETE
    @DeleteMapping("/delete/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        return service.deleteVisitor(id);
    }
}