package com.example.backend.employee.service;

import com.example.backend.config.EmailService;
import com.example.backend.employee.dto.request.EmpRequest;
import com.example.backend.employee.dto.response.EmpResponse;
import com.example.backend.employee.model.Employee;
import com.example.backend.employee.repository.EmployeeRepository;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.organization.model.Organization;
import com.example.backend.user.model.Role;
import com.example.backend.user.model.User;
import com.example.backend.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailservice;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public EmpResponse createEmployee(EmpRequest request, User loggedInUser) {

        // ✅ 1. Role check
        if (!loggedInUser.getRole().equals(Role.ORG_ADMIN)) {
            throw new UnauthorizedException("Only ORG_ADMIN can create employees");
        }

        Organization org = loggedInUser.getOrganization();

        // ✅ 2. Email validation
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        // ✅ 3. Password validation (IMPORTANT)
        String rawPassword = request.getPassword();
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new BadRequestException("Password is required");
        }

        // 🔥 Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setStatus("ACTIVE");
        user.setOrganization(org);

        // ✅ 4. Role assignment
        if ("ORG_ADMIN".equalsIgnoreCase(request.getRole())) {
            user.setRole(Role.ORG_ADMIN);
        } else if ("SECURITY".equalsIgnoreCase(request.getRole())) {
            user.setRole(Role.SECURITY);
        } else {
            user.setRole(Role.EMPLOYEE);
        }

        User savedUser = userRepository.save(user);

        // 🔥 Create Employee
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setStatus("ACTIVE");
        employee.setOrganization(org);
        employee.setUser(savedUser);

        // ✅ 5. Shift validation
        try {
            LocalTime start = LocalTime.parse(request.getShiftStart());
            LocalTime end = LocalTime.parse(request.getShiftEnd());

            if (end.isBefore(start)) {
                throw new BadRequestException("Shift end must be after start");
            }

            employee.setShiftStart(start);
            employee.setShiftEnd(end);

        } catch (Exception e) {
            throw new BadRequestException("Invalid shift format (HH:mm:ss)");
        }

        Employee savedEmployee = employeeRepository.save(employee);

        // ✅ 6. Send Email (wrapped in try-catch → avoids API failure)
        try {
            emailservice.sendEmployeeCredentials(
                    savedEmployee.getEmail(),
                    savedEmployee.getName(),
                    rawPassword
            );
        } catch (Exception e) {
            // 🔥 Don't break API if email fails
            System.out.println("Email sending failed: " + e.getMessage());
        }

        // ✅ 7. Return response
        return mapToResponse(savedEmployee, "Employee created successfully");
    }



    // 🔥 UPDATE EMPLOYEE
    @Override
    public EmpResponse updateEmployee(Long id, EmpRequest request) {

        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        User user = emp.getUser();

        emp.setName(request.getName());
        emp.setEmail(request.getEmail());
        emp.setDepartment(request.getDepartment());
        emp.setPhone(request.getPhone());
        emp.setDesignation(request.getDesignation());

        // 🔥 Role update
        if (request.getRole() != null) {
            try {
                user.setRole(Role.valueOf(request.getRole().toUpperCase()));
            } catch (Exception e) {
                throw new BadRequestException("Invalid role");
            }
        }

        // 🔥 Shift update
        try {
            LocalTime start = LocalTime.parse(request.getShiftStart());
            LocalTime end = LocalTime.parse(request.getShiftEnd());

            if (end.isBefore(start)) {
                throw new BadRequestException("Shift end must be after start");
            }

            emp.setShiftStart(start);
            emp.setShiftEnd(end);

        } catch (Exception e) {
            throw new BadRequestException("Invalid shift format");
        }

        userRepository.save(user);
        Employee updated = employeeRepository.save(emp);

        return mapToResponse(updated, "Employee updated successfully");
    }

    // 🔥 GET BY ID
    @Override
    public EmpResponse getEmployeeById(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return mapToResponse(emp, "Employee fetched");
    }

    // 🔥 UPDATE STATUS
    @Override
    @Transactional
    public EmpResponse updateEmployeeStatus(Long userId, String status) {

        System.out.println("STATUS RECEIVED: " + status);

        if (status == null || status.isBlank()) {
            throw new BadRequestException("Status cannot be null");
        }

        String newStatus = status.trim().toUpperCase();

        if (!newStatus.equals("ACTIVE") && !newStatus.equals("INACTIVE")) {
            throw new BadRequestException("Invalid status: " + newStatus);
        }

        // ✅ Find employee by USER id, not employee id
        Employee emp = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for user: " + userId));

        emp.setStatus(newStatus);

        // ✅ Also update the User status
        User user = emp.getUser();
        if (user != null) {
            user.setStatus(newStatus);
            userRepository.save(user);
        }

        employeeRepository.save(emp);

        return mapToResponse(emp, "Status updated successfully");
    }
    // 🔥 GET ALL
    @Override
    public List<EmpResponse> getAllEmployees() {

        List<Employee> list = employeeRepository.findAll();

        if (list.isEmpty()) {
            throw new ResourceNotFoundException("No employees found");
        }

        return list.stream()
                .map(emp -> mapToResponse(emp, "Fetched"))
                .toList();
    }

    // 🔥 COMMON RESPONSE
    private EmpResponse mapToResponse(Employee emp, String message) {
        return new EmpResponse(
                emp.getId(),
                emp.getName(),
                emp.getEmail(),
                emp.getDepartment(),
                emp.getUser() != null ? emp.getUser().getRole().name() : "EMPLOYEE",
                emp.getStatus(), // Make sure this order matches your EmpResponse constructor!
                emp.getShiftStart() != null ? emp.getShiftStart().toString() : "09:00:00",
                emp.getShiftEnd() != null ? emp.getShiftEnd().toString() : "18:00:00",
                emp.getPhone(),
                message
        );
    }
    }
