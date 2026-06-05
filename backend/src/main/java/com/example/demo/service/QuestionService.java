package com.example.demo.service;

import com.example.demo.dto.question.QuestionRequest;
import com.example.demo.dto.question.QuestionResponse;
import com.example.demo.entity.Pdf;
import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.exception.BusinessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    // テーマ別取得
    public List<QuestionResponse> getQuestionsByTheme(Integer themeId) {

        return questionRepository.findByPdf_PdfId(themeId)
                .stream()
                .map(q -> {
                    QuestionResponse qr = new QuestionResponse();
                    qr.setQuestionId(q.getQuestionId());
                    qr.setQuestionText(q.getQuestionText());
                    qr.setCorrectAnswer(q.getCorrectAnswer());
                    return qr;
                })
                .toList();
    }

    // 単体取得
    public QuestionResponse getQuestion(Integer id) {

        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("問題が見つかりません"));

        QuestionResponse res = new QuestionResponse();
        res.setQuestionId(q.getQuestionId());
        res.setQuestionText(q.getQuestionText());
        res.setCorrectAnswer(q.getCorrectAnswer());

        return res;
    }

    // 作成
    public QuestionResponse createQuestion(QuestionRequest request) {

        Question question = new Question();
        question.setQuestionText(request.getQuestionText());
        question.setCorrectAnswer(request.getCorrectAnswer());

        Pdf pdf = new Pdf();
        pdf.setPdfId(request.getPdfId());
        question.setPdf(pdf);

        Question saved = questionRepository.save(question);

        QuestionResponse res = new QuestionResponse();
        res.setQuestionId(saved.getQuestionId());
        res.setQuestionText(saved.getQuestionText());
        res.setCorrectAnswer(saved.getCorrectAnswer());

        return res;
    }

    // 更新
    public QuestionResponse updateQuestion(Integer id, QuestionRequest request) {

        Question existing = questionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("問題が見つかりません"));

        existing.setQuestionText(request.getQuestionText());
        existing.setCorrectAnswer(request.getCorrectAnswer());

        // 💡 既存のPDFリレーションを守るための防衛ロジックにゃ！
        if (request.getPdfId() != null) {
            Pdf pdf = new Pdf();
            pdf.setPdfId(request.getPdfId());
            existing.setPdf(pdf);
        } // request.getPdfId() が null の場合は existing.getPdf() をそのまま維持するので安全にゃ！

        Question saved = questionRepository.save(existing);

        QuestionResponse res = new QuestionResponse();
        res.setQuestionId(saved.getQuestionId());
        res.setQuestionText(saved.getQuestionText());
        res.setCorrectAnswer(saved.getCorrectAnswer());

        return res;
    }

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(q -> {
                    QuestionResponse qr = new QuestionResponse();
                    qr.setQuestionId(q.getQuestionId());
                    qr.setQuestionText(q.getQuestionText());
                    qr.setCorrectAnswer(q.getCorrectAnswer());
                    return qr;
                })
                .toList();
    }

    public void deleteQuestion(Integer id) {
        questionRepository.deleteById(id);
    }

}