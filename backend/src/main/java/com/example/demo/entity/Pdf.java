package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pdfs")
@EntityListeners(org.springframework.data.jpa.domain.support.AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pdf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pdfId;

    @Column(nullable = false, length = 25)
    private String title;

    // 💡 4つのステータスを管理するカラムを追加（初期値: draft）
    @Column(nullable = false, length = 15)
    private String status = "draft";

    // 💡 公開開始日時（予約時間用、null許容。空なら即時公開など）
    @Column(name = "open_at")
    private LocalDateTime openAt;

    // 💡 公開終了日時（null許容、設定しなければ公開終了なし）
    @Column(name = "close_at")
    private LocalDateTime closeAt;

    @OneToMany(mappedBy = "pdf", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}