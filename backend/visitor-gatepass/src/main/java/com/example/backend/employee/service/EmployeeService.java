package com.example.backend.employee.service;

import com.example.backend.employee.dto.request.EmpRequest;
import com.example.backend.employee.dto.response.EmpResponse;
import com.example.backend.employee.model.Employee;
import com.example.backend.user.model.User;

import java.util.List;

public interface EmployeeService {

    EmpResponse createEmployee(EmpRequest request, User loggedInUser);

    EmpResponse updateEmployee(Long id, EmpRequest request);

  EmpResponse getEmployeeById(Long id);

    EmpResponse updateEmployeeStatus(Long id, String status);
    List<EmpResponse> getAllEmployees();
}