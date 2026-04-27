
package com.example.backend.exception;


import com.example.backend.exception.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice(basePackages = "com.example.backend.employee")
public class EmployeeExceptionHandler {

    // 🔴 Employee Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "EMPLOYEE_NOT_FOUND", HttpStatus.NOT_FOUND, request);
    }

    // 🔴 Bad Request (validation, duplicate email, wrong input)
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
            BadRequestException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "EMPLOYEE_BAD_REQUEST", HttpStatus.BAD_REQUEST, request);
    }

    // 🔴 Unauthorized (role issue)
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(
            UnauthorizedException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "EMPLOYEE_UNAUTHORIZED", HttpStatus.UNAUTHORIZED, request);
    }

    // 🔴 Validation Errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "EMPLOYEE_VALIDATION_ERROR",
                errors,
                request.getRequestURI()
        );

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 🔴 Illegal State (business logic issues)
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(
            IllegalStateException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "EMPLOYEE_ILLEGAL_STATE", HttpStatus.BAD_REQUEST, request);
    }

    // 🔴 Any Other Exception (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobal(
            Exception ex,
            HttpServletRequest request
    ) {
        return buildResponse(
                "Employee module error occurred",
                "EMPLOYEE_INTERNAL_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR,
                request
        );
    }

    // 🔥 COMMON METHOD (clean code)
    private ResponseEntity<ErrorResponse> buildResponse(
            Object message,
            String error,
            HttpStatus status,
            HttpServletRequest request
    ) {
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, status);
    }
}