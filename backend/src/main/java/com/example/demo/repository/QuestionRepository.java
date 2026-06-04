package com.example.demo.repository;

import com.example.demo.entity.Question;
import com.example.demo.dto.progress.QuestionProgressDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    List<Question> findByPdf_PdfId(Integer pdfId);

    // ★進捗取得（これを追加）
    // @Query("""
    // SELECT new com.example.demo.dto.progress.QuestionProgressDto(
    // q.id,
    // COUNT(a.id)
    // )
    // FROM Question q
    // LEFT JOIN Answer a ON a.question.id = q.id
    // GROUP BY q.id
    // """)
    // List<QuestionProgressDto> getQuestionProgressStats();
}