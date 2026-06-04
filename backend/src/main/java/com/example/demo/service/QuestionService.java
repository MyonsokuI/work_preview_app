package com.example.demo.service;

import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> getQuestionsByTheme(Integer themeId) {
        return questionRepository.findByPdf_PdfId(themeId);
    }

    public Question getQuestion(Integer id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(Integer id, Question updated) {
        Question q = getQuestion(id);
        q.setQuestionText(updated.getQuestionText());
        q.setCorrectAnswer(updated.getCorrectAnswer());
        return questionRepository.save(q);
    }

    public void deleteQuestion(Integer id) {
        questionRepository.deleteById(id);
    }
}