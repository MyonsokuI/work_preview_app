package com.example.demo.repository;

import com.example.demo.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {

    List<Answer> findByUser_UserId(Integer userId);

    List<Answer> findByQuestion_QuestionId(Integer questionId);

    // 🔥 メソッド名の末尾を OrderByIdDesc から OrderByAnswerIdDesc に変更します
    java.util.Optional<Answer> findFirstByUser_UserIdAndQuestion_QuestionIdOrderByAnswerIdDesc(Integer userId,
            Integer questionId);
}