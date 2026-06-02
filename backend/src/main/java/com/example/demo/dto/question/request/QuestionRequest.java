package com.example.demo.dto.question.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionRequest {
    private Integer pdfId;
    private String questionText;
    private String correctAnswer;
}
