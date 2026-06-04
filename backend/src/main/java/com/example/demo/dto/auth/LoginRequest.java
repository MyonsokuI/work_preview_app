package com.example.demo.dto.auth;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequest {
    @NotNull(message = "ユーザーIDは必須です")
    private Integer userId;

    @NotBlank(message = "パスワードは必須です")
    private String password;
}