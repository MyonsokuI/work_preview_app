package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.example.demo.entity.enums.ContentsStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@EntityListeners(org.springframework.data.jpa.domain.support.AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionId;

    @ManyToOne
    @JoinColumn(name = "pdf_id")
    private Pdf pdf;

    @Column(columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String correctAnswer;

    // 💡 ここから3つのフィールドを追記にゃ！
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private ContentsStatus status; // DRAFT, SCHEDULED, PUBLISHED, CLOSED

    private LocalDateTime openAt;

    private LocalDateTime closeAt;

    // 🚀 ここを追記にゃ！
    // 問題が消えたら、その問題に対する回答（answers）も残さずシュッと全消去するにゃ！
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}