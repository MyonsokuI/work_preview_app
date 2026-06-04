package com.example.demo.dto.theme;

import java.util.List;

import com.example.demo.dto.question.QuestionResponse;

import lombok.Data;

@Data
public class ThemeWithQuestionsResponse {
  private Integer pdfId;
  private String title;
  private List<QuestionResponse> questions;
}
