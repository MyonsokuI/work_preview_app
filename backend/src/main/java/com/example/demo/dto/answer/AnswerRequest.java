package com.example.demo.dto.answer;

import lombok.Data;

@Data
public class AnswerRequest {
    private Integer questionId;
    private String answerContent;
}