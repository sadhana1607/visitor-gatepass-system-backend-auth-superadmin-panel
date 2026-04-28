package com.example.backend.employee.repository;

import com.example.backend.employee.model.Employee;
import com.example.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {

    Employee findByUser(User admin);
}
