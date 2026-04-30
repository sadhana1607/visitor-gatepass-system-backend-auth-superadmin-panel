package com.example.backend.employee.controller;

import com.example.backend.employee.dto.request.EmpRequest;
import com.example.backend.employee.dto.request.UpdateStatusRequest;
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

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    @Autowired
    private UserRepository userRepository;

    // CREATE EMPLOYEE
    @PostMapping("/create")
    public ResponseEntity<EmpResponse> createEmployee(
            @Valid @RequestBody EmpRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User loggedInUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return ResponseEntity.ok(service.createEmployee(request, loggedInUser));
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<EmpResponse> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getEmployeeById(id));
    }

    // UPDATE EMPLOYEE
    @PutMapping("/update/{id}")
    public ResponseEntity<EmpResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmpRequest request
    ) {
        return ResponseEntity.ok(service.updateEmployee(id, request));
    }

    // UPDATE STATUS
    @PutMapping("/status/{id}")
    public ResponseEntity<EmpResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        return ResponseEntity.ok(service.updateEmployeeStatus(id, request.status()));
    }

    // GET ALL
    @GetMapping("/all")
    public ResponseEntity<List<EmpResponse>> getAllEmployees() {
        return ResponseEntity.ok(service.getAllEmployees());
    }

}