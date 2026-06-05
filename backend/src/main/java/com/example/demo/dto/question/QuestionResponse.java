package com.example.demo.dto.question;

import lombok.Data;

@Data
public class QuestionResponse {
    private Integer questionId;
    private String questionText;
    private String correctAnswer;
}
