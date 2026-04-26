package com.example.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;

    // 🔥 CHANGE HERE (String → Object)
    private Object message;

    private String path;
}