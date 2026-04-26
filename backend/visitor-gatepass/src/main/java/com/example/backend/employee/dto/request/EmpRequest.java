package com.example.backend.employee.dto.request;
import lombok.Data;

@Data
public class EmpRequest {

        private String name;
        private String email;
        private String department;
        private String role;
        private String status;
        private String shiftStart;
        private String shiftEnd;
    }

