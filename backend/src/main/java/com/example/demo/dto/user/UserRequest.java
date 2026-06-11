package com.example.demo.dto.user;

import lombok.Data;

@Data
public class UserRequest {
    private Integer employeeId;
    private String name;
    private String password;
}
