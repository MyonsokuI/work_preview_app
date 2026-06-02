package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.repository.AnswerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;

    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public Answer createAnswer(Answer answer) {
        answer.setSubmittedAt(LocalDateTime.now());
        return answerRepository.save(answer);
    }

    public Answer updateAnswer(Integer id, Answer updated) {

        Answer existing = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("回答が見つかりません"));

        existing.setAnswerContent(updated.getAnswerContent());

        return answerRepository.save(existing);
    }

    public List<Answer> getMyAnswers(Integer userId) {
        return answerRepository.findByUser_UserId(userId);
    }

    public List<Answer> getAnswersByQuestion(Integer questionId) {
        return answerRepository.findByQuestion_QuestionId(questionId);
    }
}