package com.example.backend.employee.service;

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ CREATE EMPLOYEE
    @Override
    public EmpResponse createEmployee(EmpRequest request, User loggedInUser) {

        // 🔐 Authorization
        if (loggedInUser.getRole() != Role.ORG_ADMIN) {
            throw new UnauthorizedException("Only ORG_ADMIN can create employees");
        }

        Organization org = loggedInUser.getOrganization();

        if (org == null) {
            throw new BadRequestException("Logged-in user has no organization");
        }

        // 🔁 Duplicate email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        Employee employee = new Employee();

        // ✅ Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("default123"));
        user.setStatus("ACTIVE");
        user.setOrganization(org);

        // 🔥 SHIFT HANDLING
        LocalTime start = null;
        LocalTime end = null;

        if (request.getShiftStart() != null && request.getShiftEnd() != null) {
            try {
                start = LocalTime.parse(request.getShiftStart());
                end = LocalTime.parse(request.getShiftEnd());

                if (end.isBefore(start)) {
                    throw new BadRequestException("Shift end must be after start");
                }

            } catch (Exception e) {
                throw new BadRequestException("Invalid shift format (HH:mm)");
            }
        }

        // 🔥 ROLE LOGIC
        if ("ORGADMIN".equalsIgnoreCase(request.getRole())) {

            user.setRole(Role.ORG_ADMIN);
            user.setStatus("PENDING");

            employee.setShiftStart(null);
            employee.setShiftEnd(null);

        } else if ("SECURITY".equalsIgnoreCase(request.getRole())) {

            user.setRole(Role.SECURITY);

            if (start == null || end == null) {
                throw new BadRequestException("Shift is required for SECURITY");
            }

            employee.setShiftStart(start);
            employee.setShiftEnd(end);

        } else {

            // ✅ EMPLOYEE (default)
            user.setRole(Role.EMPLOYEE);

            // ✅ Default shift
            employee.setShiftStart(LocalTime.of(9, 0));
            employee.setShiftEnd(LocalTime.of(20, 0));
        }

        // 🔗 Save user first
        User savedUser = userRepository.save(user);

        // ✅ Create Employee
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setOrganization(org);
        employee.setUser(savedUser);
        employee.setStatus("ACTIVE");
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());

        Employee savedEmployee = employeeRepository.save(employee);

        return mapToResponse(savedEmployee, "Employee created successfully");
    }

    // ✅ UPDATE EMPLOYEE
    @Override
    public EmpResponse updateEmployee(Long id, EmpRequest request) {

        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        User user = emp.getUser(); // ✅ FIX (use existing user)

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
                throw new BadRequestException("Invalid role value");
            }
        }

        // 🔥 Shift handling
        if ("SECURITY".equalsIgnoreCase(request.getRole())) {
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

        } else {
            emp.setShiftStart(null);
            emp.setShiftEnd(null);
        }

        userRepository.save(user);
        Employee savedEmployee = employeeRepository.save(emp);

        return mapToResponse(savedEmployee, "Employee updated successfully");
    }

    // ✅ GET BY ID
    @Override
    public EmpResponse getEmployeeById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return mapToResponse(employee, "Employee fetched successfully");
    }

    // ✅ UPDATE STATUS
    @Override
    public EmpResponse updateEmployeeStatus(Long id, String status) {

        if (!status.equalsIgnoreCase("ACTIVE") &&
                !status.equalsIgnoreCase("INACTIVE")) {
            throw new BadRequestException("Invalid status");
        }

        String finalStatus = status.toUpperCase();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setStatus(finalStatus);
        userRepository.save(user);

        Employee employee = null;

        Optional<Employee> empOpt = employeeRepository.findByUserId(id);

        if (empOpt.isPresent()) {
            employee = empOpt.get();
            employee.setStatus(finalStatus);
            employeeRepository.save(employee);
        }

        return new EmpResponse(
                id,
                user.getName(),
                user.getEmail(),
                employee != null ? employee.getDepartment() : null,
                user.getRole().name(),
                employee != null && employee.getShiftStart() != null
                        ? employee.getShiftStart().toString() : null,
                employee != null && employee.getShiftEnd() != null
                        ? employee.getShiftEnd().toString() : null,
                "Status updated successfully",
                finalStatus
        );
    }

    // 🔥 COMMON RESPONSE METHOD
    private EmpResponse mapToResponse(Employee emp, String message) {
        return new EmpResponse(
                emp.getId(),
                emp.getName(),
                emp.getEmail(),
                emp.getDepartment(),
                emp.getUser().getRole().name(),
                emp.getShiftStart() != null ? emp.getShiftStart().toString() : null,
                emp.getShiftEnd() != null ? emp.getShiftEnd().toString() : null,
                message,
                emp.getStatus()
        );
    }

    @Override
    public List<EmpResponse> getAllEmployees() {

        List<Employee> employees = employeeRepository.findAll();

        if (employees.isEmpty()) {
            throw new ResourceNotFoundException("No employees found");
        }

        return employees.stream()
                .map(emp -> mapToResponse(emp, "Employee fetched successfully"))
                .toList();
    }
}