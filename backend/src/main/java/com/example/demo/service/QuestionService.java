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

    // テーマ別取得
    public List<Question> getQuestionsByTheme(Integer themeId) {
        return questionRepository.findByPdf_PdfId(themeId);
    }

    // 単体取得
    public Question getQuestion(Integer id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("問題が見つかりません"));
    }

    // 作成
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    // 更新
    public Question updateQuestion(Integer id, Question updated) {

        Question existing = getQuestion(id);

        existing.setQuestionText(updated.getQuestionText());
        existing.setCorrectAnswer(updated.getCorrectAnswer());
        existing.setPdf(updated.getPdf());

        return questionRepository.save(existing);
    }

    // 削除
    public void deleteQuestion(Integer id) {
        questionRepository.deleteById(id);
    }
}