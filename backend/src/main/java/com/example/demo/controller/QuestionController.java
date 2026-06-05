package com.example.demo.controller;

import com.example.demo.dto.question.QuestionRequest;
import com.example.demo.dto.question.QuestionResponse;
import com.example.demo.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
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
    @GetMapping("/themes/{themeId}/questions")
    public List<QuestionResponse> getQuestionsByTheme(@PathVariable Integer themeId) {

        return questionService.getQuestionsByTheme(themeId);
    }

    // ==========================================
    // ① 全問題取得（フロント初期表示用）
    // ==========================================
    @GetMapping("/questions")
    public List<QuestionResponse> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    /**
     * 問題詳細取得
     * GET /api/questions/{id}
     */
    @GetMapping("/questions/{id}")
    public QuestionResponse getQuestion(@PathVariable Integer id) {
        return questionService.getQuestion(id);
    }

    /**
     * 問題作成
     * POST /api/questions
     */
    @PostMapping("/questions")
    public QuestionResponse createQuestion(@RequestBody QuestionRequest request) {
        return questionService.createQuestion(request);
    }

    /**
     * 問題更新
     * PUT /api/questions/{id}
     */
    @PutMapping("/questions/{id}")
    public QuestionResponse updateQuestion(
            @PathVariable Integer id,
            @RequestBody QuestionRequest question) {

        return questionService.updateQuestion(id, question);
    }

    // ==========================================
    // ⑥ 削除
    // ==========================================
    @DeleteMapping("/questions/{id}")
    public void deleteQuestion(@PathVariable Integer id) {
        questionService.deleteQuestion(id);
    }
}