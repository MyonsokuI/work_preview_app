package com.example.demo.dto.theme;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class ThemeRequest {
    @NotBlank(message = "テーマ名は必須です")
    @Size(max = 100, message = "テーマ名は100文字以内で入力してください")
    private String title;
}