package com.example.demo.repository;

import com.example.demo.entity.Question;
import com.example.demo.dto.progress.QuestionProgressDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    List<Question> findByPdf_PdfId(Integer pdfId);

    // 🚀 フィールド名をエンティティ（questionId, answerId）に完全に合わせたにゃ！
    @Query("""
            SELECT new com.example.demo.dto.progress.QuestionProgressDto(
                q.questionId,
                COUNT(a.answerId)
            )
            FROM Question q
            LEFT JOIN Answer a ON a.question.questionId = q.questionId
            GROUP BY q.questionId
            """)
    List<QuestionProgressDto> getQuestionProgressStats();
}