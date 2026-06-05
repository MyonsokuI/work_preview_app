package com.example.demo.repository;

import com.example.demo.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {

    List<Answer> findByUser_UserId(Integer userId);

    List<Answer> findByQuestion_QuestionId(Integer questionId);

    boolean existsByUser_UserIdAndQuestion_QuestionId(
            Integer userId,
            Integer questionId);
}