package com.example.backend.Visitor.service;

import com.example.backend.employee.model.Employee;
import com.example.backend.employee.repository.EmployeeRepository;
import com.example.backend.Visitor.dto.VisitorRequestDto;
import com.example.backend.Visitor.entity.VisitorRequest;
import com.example.backend.Visitor.repository.VisitorRequestRepository;
import com.example.backend.config.EmailService;
import com.example.backend.payload.ApiResponse;
import com.example.backend.utils.GatePassUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitorRequestService {

    @Autowired
    private VisitorRequestRepository repo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private GatePassUtil util;

    @Autowired
    private EmailService emailService;

    // ✅ CREATE VISITOR + OTP
    public ApiResponse createRequest(VisitorRequestDto dto) {

        // 🔥 VALIDATION
        if (dto.getEmployeeId() == null) {
            throw new RuntimeException("EmployeeId is required");
        }

        Employee emp = employeeRepo.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + dto.getEmployeeId()));

        VisitorRequest vr = new VisitorRequest();
        vr.setVisitorName(dto.getVisitorName());
        vr.setEmail(dto.getEmail());
        vr.setPurpose(dto.getPurpose());
        vr.setVisitDate(dto.getVisitDate());
        vr.setEmployee(emp);

        // 🔥 OTP + GatePass
        String otp = util.generateOTP();
        String gatePass = util.generateGatePass();

        vr.setOtp(otp);
        vr.setGatePassCode(gatePass);
        vr.setStatus("PENDING");

        // 🔥 SAVE FIRST (better practice)
        repo.save(vr);

        // 🔥 SEND EMAIL
        emailService.sendOtp(dto.getEmail(), otp);

        return new ApiResponse("Visitor Created + OTP Sent", vr);
    }

    // ✅ GET ALL
    public List<VisitorRequest> getAllVisitors() {
        return repo.findAll();
    }

    // ✅ GET BY EMAIL
    public List<VisitorRequest> getByEmail(String email) {
        return repo.findByEmail(email);
    }

    // ✅ VERIFY OTP
    public ApiResponse verifyOtp(String email, String otp) {

        List<VisitorRequest> list = repo.findByEmail(email);

        if (list.isEmpty()) {
            return new ApiResponse("Visitor not found", null);
        }

        VisitorRequest vr = list.get(list.size() - 1);

        if (vr.getOtp().equals(otp)) {
            vr.setStatus("APPROVED");
            repo.save(vr);
            return new ApiResponse("OTP Verified ✅ Gate Pass Approved", vr);
        } else {
            return new ApiResponse("Invalid OTP ❌", null);
        }
    }

    // ✅ RESEND OTP
    public ApiResponse resendOtp(String email) {

        List<VisitorRequest> list = repo.findByEmail(email);

        if (list.isEmpty()) {
            return new ApiResponse("Visitor not found", null);
        }

        VisitorRequest vr = list.get(list.size() - 1);

        String newOtp = util.generateOTP();
        vr.setOtp(newOtp);
        repo.save(vr);

        emailService.sendOtp(email, newOtp);

        return new ApiResponse("OTP Resent Successfully", vr);
    }

    // ✅ DELETE
    public ApiResponse deleteVisitor(Long id) {

        if (!repo.existsById(id)) {
            return new ApiResponse("Visitor not found", null);
        }

        repo.deleteById(id);
        return new ApiResponse("Visitor Deleted Successfully", null);
    }
}