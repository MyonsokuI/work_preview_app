package com.example.demo.controller;

import com.example.demo.dto.question.QuestionRequest;
import com.example.demo.dto.question.QuestionResponse;
import com.example.demo.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /**
     * テーマごとの問題一覧取得
     * GET /api/themes/{themeId}/questions
     */
    @GetMapping("/api/themes/{themeId}/questions")
    public List<QuestionResponse> getQuestionsByTheme(@PathVariable Integer themeId) {

        return questionService.getQuestionsByTheme(themeId);
    }

    /**
     * 問題詳細取得
     * GET /api/questions/{id}
     */
    @GetMapping("/api/questions/{id}")
    public QuestionResponse getQuestion(@PathVariable Integer id) {
        return questionService.getQuestion(id);
    }

    /**
     * 問題作成
     * POST /api/questions
     */
    @PostMapping("/api/questions")
    public QuestionResponse createQuestion(@RequestBody QuestionRequest request) {
        return questionService.createQuestion(request);
    }

    /**
     * 問題更新
     * PUT /api/questions/{id}
     */
    @PutMapping("/api/questions/{id}")
    public QuestionResponse updateQuestion(
            @PathVariable Integer id,
            @RequestBody QuestionRequest question) {

        return questionService.updateQuestion(id, question);
    }

    /**
     * 問題削除
     * DELETE /api/questions/{id}
     */
    @DeleteMapping("/api/questions/{id}")
    public void deleteQuestion(
            @PathVariable Integer id) {

        questionService.deleteQuestion(id);
    }
}