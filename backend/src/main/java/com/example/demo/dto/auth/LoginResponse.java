package com.example.demo.dto.auth;

import lombok.Data;

@Data
public class LoginResponse {
    private Integer userId;
    private Integer employeeId;
    private String name;
    private String role;
    private String token;
}