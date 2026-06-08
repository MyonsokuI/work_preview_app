package com.example.demo.dto.theme;

import java.time.LocalDateTime;
import java.util.List;
import com.example.demo.dto.question.QuestionResponse;
import lombok.Data;

@Data
public class ThemeWithQuestionsResponse {
  private Integer pdfId;
  private String title;
  // 💡 こちらにもステータスと日時情報を追加にゃ！
  private String status;
  private LocalDateTime openAt;
  private LocalDateTime closeAt;
  private List<QuestionResponse> questions;
}