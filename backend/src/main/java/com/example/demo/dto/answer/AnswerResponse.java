package com.example.demo.dto.answer;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AnswerResponse {
    private Integer answerId;
    private Integer questionId;
    private Integer userId;
    private String answerContent;
    private LocalDateTime submittedAt;
}
