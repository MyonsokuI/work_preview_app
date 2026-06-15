package com.example.demo.service;

import com.example.demo.dto.question.QuestionRequest;
import com.example.demo.dto.question.QuestionResponse;
import com.example.demo.entity.Question;
import com.example.demo.entity.enums.ContentsStatus;
import com.example.demo.entity.Pdf;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.util.StatusCalculator;
import com.example.demo.repository.PdfRepository;
import com.example.demo.exception.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final PdfRepository pdfRepository; // テーマ取得用にインジェクションにゃ

    public QuestionService(QuestionRepository questionRepository, PdfRepository pdfRepository) {
        this.questionRepository = questionRepository;
        this.pdfRepository = pdfRepository;
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream().map(this::convertToResponse).toList();
    }

    // QuestionService.java 内の修正箇所
    @Transactional
    public List<QuestionResponse> getQuestionsByTheme(Integer pdfId) {
        List<Question> questions = questionRepository.findByPdf_PdfId(pdfId);
        boolean needsUpdate = false;

        for (Question q : questions) {
            ContentsStatus correctStatus = StatusCalculator.calculateStatus(
                    q.getStatus(),
                    q.getOpenAt(),
                    q.getCloseAt());
            if (correctStatus != q.getStatus()) {
                q.setStatus(correctStatus);
            }
        }

        if (needsUpdate) {
            questionRepository.saveAll(questions);
        }

        return questions.stream().map(this::convertToResponse).toList();
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestion(Integer id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("問題が見つかりません"));
        return convertToResponse(q);
    }

    /**
     * 🟢 問題新規作成（フロントで全部入力し終わった後にインサートされるにゃ！）
     */
    @Transactional
    public QuestionResponse createQuestion(QuestionRequest request) {
        Pdf pdf = pdfRepository.findById(request.getPdfId())
                .orElseThrow(() -> new BusinessException("指定されたテーマが見つかりません"));

        Question q = new Question();
        q.setPdf(pdf);
        q.setQuestionText(request.getQuestionText());
        q.setCorrectAnswer(request.getCorrectAnswer());
        q.setOpenAt(request.getOpenAt());
        q.setCloseAt(request.getCloseAt());

        // 💡 登録時のステータス決定ロジック（Themeと同じにゃ！）
        if ("draft".equalsIgnoreCase(request.getStatus())) {
            q.setStatus(ContentsStatus.DRAFT);
        } else {
            LocalDateTime now = LocalDateTime.now();
            if (request.getOpenAt() != null && request.getOpenAt().isAfter(now)) {
                q.setStatus(ContentsStatus.SCHEDULED);
            } else {
                q.setStatus(ContentsStatus.SCHEDULED);
            }
        }

        Question saved = questionRepository.save(q);
        return convertToResponse(saved);
    }

    /**
     * 💾 問題更新
     */
    @Transactional
    public QuestionResponse updateQuestion(Integer id, QuestionRequest request) {
        Question existing = questionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("問題が見つかりません"));

        existing.setQuestionText(request.getQuestionText());
        existing.setCorrectAnswer(request.getCorrectAnswer());
        existing.setOpenAt(request.getOpenAt());
        existing.setCloseAt(request.getCloseAt());

        // 💡 更新時のステータス決定ロジック
        if ("draft".equalsIgnoreCase(request.getStatus())) {
            existing.setStatus(ContentsStatus.DRAFT);
        } else {
            LocalDateTime now = LocalDateTime.now();
            if (request.getCloseAt() != null && request.getCloseAt().isBefore(now)) {
                existing.setStatus(ContentsStatus.CLOSED);
            } else if (request.getOpenAt() != null && request.getOpenAt().isAfter(now)) {
                existing.setStatus(ContentsStatus.SCHEDULED);
            } else {
                existing.setStatus(ContentsStatus.PUBLISHED);
            }
        }

        Question saved = questionRepository.save(existing);
        return convertToResponse(saved);
    }

    @Transactional
    public void deleteQuestion(Integer id) {
        questionRepository.deleteById(id);
    }

    // Entity -> ResponseDTO 詰め替えヘルパー
    private QuestionResponse convertToResponse(Question q) {
        QuestionResponse res = new QuestionResponse();
        res.setQuestionId(q.getQuestionId());
        res.setQuestionText(q.getQuestionText());
        res.setCorrectAnswer(q.getCorrectAnswer());
        res.setStatus(q.getStatus());
        res.setOpenAt(q.getOpenAt());
        res.setCloseAt(q.getCloseAt());
        return res;
    }
}