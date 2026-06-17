package com.example.demo.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {

    @NotNull(message = "社員IDを入力してください")
    private Integer employeeId;

    @NotBlank(message = "ユーザー名を入力してください")
    private String name;

    @NotBlank(message = "パスワードを入力してください")
    @Size(min = 8, max = 20, message = "パスワードは8～20文字で入力してください")
    private String password;
}