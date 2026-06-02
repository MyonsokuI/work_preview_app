package com.example.demo.controller;

import com.example.demo.entity.Answer;
import com.example.demo.service.AnswerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    /**
     * 回答登録
     * POST /api/answers
     */
    @PostMapping("/answers")
    public Answer createAnswer(@RequestBody Answer answer) {
        return answerService.createAnswer(answer);
    }

    /**
     * 回答更新
     * PUT /api/answers/{id}
     */
    @PutMapping("/answers/{id}")
    public Answer updateAnswer(
            @PathVariable Integer id,
            @RequestBody Answer answer) {

        return answerService.updateAnswer(id, answer);
    }

    /**
     * 自分の回答一覧取得
     * GET /api/answers/my?userId=1
     */
    @GetMapping("/answers/my")
    public List<Answer> getMyAnswers(
            @RequestParam Integer userId) {

        return answerService.getMyAnswers(userId);
    }

    /**
     * 問題ごとの回答一覧取得
     * GET /api/questions/{questionId}/answers
     */
    @GetMapping("/questions/{questionId}/answers")
    public List<Answer> getAnswersByQuestion(
            @PathVariable Integer questionId) {

        return answerService.getAnswersByQuestion(questionId);
    }
}