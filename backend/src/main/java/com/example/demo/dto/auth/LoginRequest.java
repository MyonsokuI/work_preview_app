package com.example.demo.dto.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private Integer userId;
    private String password;
}