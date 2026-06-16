package com.example.demo.dto.theme;

import java.time.LocalDateTime;

import com.example.demo.entity.enums.ContentsStatus;

import lombok.Data;

@Data
public class ThemeResponse {
    private Integer pdfId;
    private String title;
    private ContentsStatus status;
    private LocalDateTime openAt;
    private LocalDateTime closeAt;
    private String fileUrl;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
    private Integer uploader;
}