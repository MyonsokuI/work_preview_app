package com.example.demo.dto.answer;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
public class AnswerRequest {
    @NotNull(message = "質問IDは必須です")
    private Integer questionId;

    @NotBlank(message = "回答内容は必須です")
    private String answerContent;
}