package com.example.backend.employee.repository;

import com.example.backend.employee.model.Employee;
import com.example.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {

    Employee findByUser(User admin);

    Optional<Employee> findByUserId(Long userId);
}
