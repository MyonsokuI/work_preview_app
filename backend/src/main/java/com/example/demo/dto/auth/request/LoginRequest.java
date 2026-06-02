package com.example.demo.dto.auth.request;

import lombok.Data;

@Data
public class LoginRequest {
    private Integer userId;
    private String password;
}