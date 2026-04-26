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

    // ✅ CREATE EMPLOYEE
    @Override
    public EmpResponse createEmployee(EmpRequest request, User loggedInUser) {

        // 🔥 FIX: Unauthorized exception
        if (!loggedInUser.getRole().equals(Role.ORG_ADMIN)) {
            throw new UnauthorizedException("Only ORG_ADMIN can create employees");
        }

        Organization org = loggedInUser.getOrganization();

        // 🔥 Duplicate email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        Employee employee = new Employee();

        // 🔥 Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("default123"));
        user.setStatus("ACTIVE");

        // 🔥 Role Handling
        if ("ORGADMIN".equalsIgnoreCase(request.getRole())) {
            user.setRole(Role.ORG_ADMIN);

        } else if ("SECURITY".equalsIgnoreCase(request.getRole())) {
            user.setRole(Role.SECURITY);

            // 🔥 Shift validation
            try {
                LocalTime start = LocalTime.parse(request.getShiftStart());
                LocalTime end = LocalTime.parse(request.getShiftEnd());

                if (end.isBefore(start)) {
                    throw new BadRequestException("Shift end must be after start");
                }

                employee.setShiftStart(start);
                employee.setShiftEnd(end);

            } catch (Exception e) {
                throw new BadRequestException("Invalid shift time format (HH:mm required)");
            }

        } else {
            user.setRole(Role.EMPLOYEE);
        }

        user.setOrganization(org);
        User savedUser = userRepository.save(user);

        // 🔥 Create Employee
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setStatus("ACTIVE");
        employee.setOrganization(org);
        employee.setUser(savedUser);

        Employee savedEmployee = employeeRepository.save(employee);

        return mapToResponse(savedEmployee, "Employee created successfully");
    }

    // ✅ UPDATE EMPLOYEE
    @Override
    public EmpResponse updateEmployee(Long id, EmpRequest request) {

        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        User user = emp.getUser();

        emp.setName(request.getName());
        emp.setEmail(request.getEmail());
        emp.setDepartment(request.getDepartment());

        // 🔥 Role update
        if (request.getRole() != null) {
            try {
                user.setRole(Role.valueOf(request.getRole().toUpperCase()));
            } catch (Exception e) {
                throw new BadRequestException("Invalid role value");
            }
        }

        // 🔥 Shift validation
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
                throw new BadRequestException("Invalid shift time format");
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
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        return mapToResponse(employee, "Employee fetched successfully");
    }

    // ✅ UPDATE STATUS
    @Override
    public EmpResponse updateEmployeeStatus(Long id, String status) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (!status.equalsIgnoreCase("ACTIVE") &&
                !status.equalsIgnoreCase("INACTIVE")) {
            throw new BadRequestException("Invalid status (Use ACTIVE / INACTIVE)");
        }

        employee.setStatus(status.toUpperCase());

        User user = employee.getUser();
        user.setStatus(status.toUpperCase());

        userRepository.save(user);
        Employee updatedEmployee = employeeRepository.save(employee);

        return mapToResponse(updatedEmployee, "Employee status updated successfully");
    }

    // ✅ GET ALL
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

    // 🔥 COMMON RESPONSE METHOD (Clean code)
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
}