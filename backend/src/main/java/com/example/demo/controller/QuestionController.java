package com.example.demo.controller;

import com.example.demo.entity.Question;
import com.example.demo.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // ==========================================
    // ① 全問題取得（フロント初期表示用）
    // ==========================================
    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // ==========================================
    // ② テーマ別問題取得（UIサイドバー用）
    // ==========================================
    @GetMapping("/themes/{themeId}/questions")
    public List<Question> getQuestionsByTheme(
            @PathVariable Integer themeId) {

        return questionService.getQuestionsByTheme(themeId);
    }

    // ==========================================
    // ③ 単体問題取得（右側詳細表示用）
    // ==========================================
    @GetMapping("/questions/{id}")
    public Question getQuestion(@PathVariable Integer id) {
        return questionService.getQuestion(id);
    }

    // ==========================================
    // ④ 作成
    // ==========================================
    @PostMapping("/questions")
    public Question createQuestion(
            @RequestBody com.example.demo.dto.question.request.QuestionRequest request) {

        Question question = new Question();
        question.setQuestionText(request.getQuestionText());
        question.setCorrectAnswer(request.getCorrectAnswer());

        com.example.demo.entity.Pdf pdf = new com.example.demo.entity.Pdf();
        pdf.setPdfId(request.getPdfId());
        question.setPdf(pdf);

        return questionService.createQuestion(question);
    }

    // ==========================================
    // ⑤ 更新
    // ==========================================
    @PutMapping("/questions/{id}")
    public Question updateQuestion(
            @PathVariable Integer id,
            @RequestBody Question question) {

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