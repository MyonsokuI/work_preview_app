package com.example.demo.dto.answer;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class AnswerRequest {
    @NotNull(message = "質問IDは必須です")
    private Integer questionId;

    private String answerContent;

    private String imagePath;
}