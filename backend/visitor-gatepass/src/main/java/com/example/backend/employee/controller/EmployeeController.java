package com.example.backend.employee.controller;

import com.example.backend.employee.dto.request.EmpRequest;
import com.example.backend.employee.dto.response.EmpResponse;
import com.example.backend.employee.service.EmployeeService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.user.model.User;
import com.example.backend.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    @Autowired
    private UserRepository userRepository;

    // 🔥 CREATE EMPLOYEE
    @PostMapping("/create")
    public ResponseEntity<EmpResponse> createEmployee(
            @Valid @RequestBody EmpRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        // 🔥 FIX: BadRequest ❌ → ResourceNotFound ✅
        User loggedInUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        EmpResponse response = service.createEmployee(request, loggedInUser);

        return ResponseEntity.ok(response);
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<EmpResponse> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getEmployeeById(id));
    }

    // 🔥 UPDATE EMPLOYEE
    @PutMapping("/update/{id}")
    public ResponseEntity<EmpResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmpRequest request
    ) {
        return ResponseEntity.ok(service.updateEmployee(id, request));
    }

    // 🔥 UPDATE STATUS
    @PutMapping("/status/{id}")
    public EmpResponse updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return service.updateEmployeeStatus(id, body.get("status"));
    }

    // ✅ GET ALL
    @GetMapping("/all")
    public ResponseEntity<List<EmpResponse>> getAllEmployees() {
        return ResponseEntity.ok(service.getAllEmployees());
    }


}