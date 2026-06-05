package com.example.demo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidation(
    MethodArgumentNotValidException ex,
    HttpServletRequest request) {

    Map<String, String> errors = new HashMap<>();

    ex.getBindingResult().getFieldErrors().forEach(error -> {
      errors.put(error.getField(), error.getDefaultMessage());
    });

    return ResponseEntity.badRequest().body(errors);
  }

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<?> handleBusiness(
    BusinessException ex,
    HttpServletRequest request) {

    Map<String, Object> error = new HashMap<>();
    error.put("code", "BUSINESS_ERROR");
    error.put("message", ex.getMessage());
    error.put("path", request.getRequestURI());

    return ResponseEntity.status(409).body(error);
  }
}