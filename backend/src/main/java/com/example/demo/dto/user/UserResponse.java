package com.example.demo.dto.user;

import com.example.demo.entity.enums.UserStatus;
import com.example.demo.entity.enums.Role;

import lombok.Data;

@Data
public class UserResponse {
    private Integer userId;
    private String name;
    private UserStatus status;
    private Role role;
}