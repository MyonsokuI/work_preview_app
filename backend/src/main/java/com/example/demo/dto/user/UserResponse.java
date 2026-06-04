package com.example.demo.dto.user;

import lombok.Data;

@Data
public class UserResponse {
    private Integer userId;
    private String name;
    private String status;
}