package com.example.demo.dto.review;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotNull(message = "回答IDは必須です")
    private Integer answerId;

    @NotBlank(message = "レビュー内容は必須です")
    private String comment;
}