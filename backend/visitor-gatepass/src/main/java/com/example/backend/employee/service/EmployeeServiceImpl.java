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

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔥 CREATE EMPLOYEE
    @Override
    public EmpResponse createEmployee(EmpRequest request, User loggedInUser) {

        if (!loggedInUser.getRole().equals(Role.ORG_ADMIN)) {
            throw new UnauthorizedException("Only ORG_ADMIN can create employees");
        }

        Organization org = loggedInUser.getOrganization();

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        // 🔥 Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("123456"));
        user.setStatus("ACTIVE");
        user.setOrganization(org);

        // 🔥 Role fix
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
        employee.setPhone(request.getPhone());              // ✅ FIX
        employee.setDesignation(request.getDesignation());  // ✅ FIX
        employee.setStatus("ACTIVE");
        employee.setOrganization(org);
        employee.setUser(savedUser);

        // 🔥 Shift for ALL roles
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
    public EmpResponse updateEmployeeStatus(Long id, String status) {

        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (!status.equalsIgnoreCase("ACTIVE") &&
                !status.equalsIgnoreCase("INACTIVE")) {
            throw new BadRequestException("Invalid status");
        }

        emp.setStatus(status.toUpperCase());
        emp.getUser().setStatus(status.toUpperCase());

        userRepository.save(emp.getUser());
        Employee updated = employeeRepository.save(emp);

        return mapToResponse(updated, "Status updated");
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
                emp.getUser().getRole().name(),
                emp.getShiftStart().toString(),
                emp.getShiftEnd().toString(),
                message,
                emp.getStatus()
        );
    }
}