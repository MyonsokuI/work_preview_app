package com.example.demo.service;

import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    // テーマ別取得
    // public List<Question> getQuestionsByTheme(Long themeId) {
    // List<Question> results = new ArrayList<>();
    // for (Question question : questionRepository.findAll()) {
    // if (question.getPdf() != null &&
    // themeId.equals(question.getPdf().getPdfId())) {
    // results.add(question);
    // }
    // }
    // return results;
    // }
    public List<Question> getQuestionsByTheme(Integer themeId) {
        return questionRepository.findByPdf_PdfId(themeId);
    }

    // 単体取得
    public Question getQuestion(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("問題が見つかりません"));
    }

    // 作成
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    // 更新
    public Question updateQuestion(Long id, Question updated) {

        Question existing = getQuestion(id);

        existing.setQuestionText(updated.getQuestionText());
        existing.setCorrectAnswer(updated.getCorrectAnswer());
        existing.setPdf(updated.getPdf());

        return questionRepository.save(existing);
    }

    // 削除
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}