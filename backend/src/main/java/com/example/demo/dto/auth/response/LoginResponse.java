package com.example.demo.dto.auth.response;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Integer userId;
    private String name;
    private String status;
}