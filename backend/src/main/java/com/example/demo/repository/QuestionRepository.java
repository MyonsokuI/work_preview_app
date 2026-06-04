package com.example.demo.repository;

import com.example.demo.dto.progress.QuestionProgressDto;
import com.example.demo.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    List<Question> findByPdf_PdfId(Integer pdfId);

    // 💡 アンダースコア(_)を排除し、すべてJavaのエンティティのフィールド名(questionId)に統一したにゃ！
    @Query("SELECT new com.example.demo.dto.progress.QuestionProgressDto(" +
            "  q.questionId, " +
            "  q.questionText, " +
            // 💡 分子：Answer(a) に紐づく User(u) の status が 'USER' のユニーク受講生数をカウント
            "  COUNT(DISTINCT case when u.status = 'USER' then u.userId end), " +
            // 💡 分母：User テーブルから status が 'USER' の受講生の総数をカウント
            "  (SELECT COUNT(u2) FROM User u2 WHERE u2.status = 'USER')" +
            ") " +
            "FROM Question q " +
            "LEFT JOIN Answer a ON q.questionId = a.question.questionId " +
            "LEFT JOIN a.user u " + // Answerの中のUserリレーションを経由
            "GROUP BY q.questionId, q.questionText " +
            "ORDER BY q.questionId ASC")
    List<QuestionProgressDto> getQuestionProgressStats();
}