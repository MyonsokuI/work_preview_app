package com.example.demo.repository;

import com.example.demo.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {

    List<Answer> findByUser_UserId(Integer userId);

    List<Answer> findByQuestion_QuestionId(Integer questionId);

    // 🚀 💡 【追加】特定のユーザーが特定の問題に回答したデータを1件だけ取得するにゃ！
    Optional<Answer> findByUser_UserIdAndQuestion_QuestionId(Integer userId, Integer questionId);
}