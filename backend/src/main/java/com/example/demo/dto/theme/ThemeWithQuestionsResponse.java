package com.example.demo.dto.theme;

import java.time.LocalDateTime;
import java.util.List;
import com.example.demo.dto.question.QuestionResponse;
import com.example.demo.entity.enums.ContentsStatus;

import lombok.Data;

@Data
public class ThemeWithQuestionsResponse {
  private Integer pdfId;
  private String title;
  // 💡 こちらにもステータスと日時情報を追加！
  private String fileUrl;
  private ContentsStatus status;
  private LocalDateTime openAt;
  private LocalDateTime closeAt;
  private LocalDateTime updatedAt;
  private LocalDateTime createdAt;
  private List<QuestionResponse> questions;
}