package com.example.demo.dto.theme;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ThemeResponse {
    private Integer pdfId;
    private String title;
    // 💡 ステータスと日時情報を追加
    private String status;
    private LocalDateTime openAt;
    private LocalDateTime closeAt;
}