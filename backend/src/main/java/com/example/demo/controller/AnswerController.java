package com.example.demo.controller;

import com.example.demo.dto.answer.AnswerRequest;
import com.example.demo.dto.answer.AnswerResponse;
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
     */
    @PostMapping("/answers")
    public AnswerResponse createAnswer(
            @RequestBody AnswerRequest request,
            @RequestParam Integer userId) {

        return answerService.createAnswer(request, userId);
    }

    /**
     * 回答更新
     * PUT /api/answers/{id}
     */
    @PutMapping("/answers/{id}")
    public AnswerResponse updateAnswer(
            @PathVariable Integer id,
            @RequestBody AnswerRequest request) {

        return answerService.updateAnswer(id, request);
    }

    /**
     * 自分の回答一覧取得
     * GET /api/answers/my?userId=1
     */
    @GetMapping("/answers/my")
    public List<AnswerResponse> getMyAnswers(
            @RequestParam Integer userId) {

        return answerService.getMyAnswers(userId);
    }

    /**
     * 問題ごとの回答一覧取得
     * GET /api/questions/{questionId}/answers
     */
    @GetMapping("/questions/{questionId}/answers")
    public List<AnswerResponse> getAnswersByQuestion(
            @PathVariable Integer questionId) {

        return answerService.getAnswersByQuestion(questionId);
    }
}