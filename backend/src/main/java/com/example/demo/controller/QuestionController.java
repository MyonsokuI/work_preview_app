package com.example.demo.controller;

import com.example.demo.entity.Question;
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
    public List<Question> getQuestionsByTheme(
            @PathVariable Integer themeId) {

        return questionService.getQuestionsByTheme(themeId);
    }

    /**
     * 問題詳細取得
     * GET /api/questions/{id}
     */
    @GetMapping("/api/questions/{id}")
    public Question getQuestion(
            @PathVariable Integer id) {

        return questionService.getQuestion(id);
    }

    /**
     * 問題作成
     * POST /api/questions
     */
    @PostMapping("/api/questions")
    public Question createQuestion(@RequestBody com.example.demo.dto.question.request.QuestionRequest request) {

        // 1. 保存用のQuestionオブジェクトを新しく作る
        Question question = new Question();
        question.setQuestionText(request.getQuestionText());
        question.setCorrectAnswer(request.getCorrectAnswer());

        // 2. 外部キーをマッピングするために、IDをセットしたPdfオブジェクトを生成して紐付ける
        com.example.demo.entity.Pdf pdf = new com.example.demo.entity.Pdf();
        pdf.setPdfId(request.getPdfId());
        question.setPdf(pdf);

        // 3. サービス層へ渡して保存
        return questionService.createQuestion(question);
    }

    /**
     * 問題更新
     * PUT /api/questions/{id}
     */
    @PutMapping("/api/questions/{id}")
    public Question updateQuestion(
            @PathVariable Integer id,
            @RequestBody Question question) {

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