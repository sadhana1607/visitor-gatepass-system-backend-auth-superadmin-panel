package com.example.backend.employee.dto.response;

import lombok.Data;

@Data
public class EmpResponse {

    private Long id;
    private String name;
    private String email;
    private String department;
    private String role;
    private String status;
    private String shiftStart;
    private String shiftEnd;
    private String message; // ✅ ADD THIS

    public EmpResponse(Long id, String name, String email,
                       String department, String role,
                       String shiftStart, String shiftEnd,String message,String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.role = role; // ✅ FIXED
        this.shiftStart = shiftStart;
        this.shiftEnd = shiftEnd;
        this.message = message;
        this.status = status;
    }


}