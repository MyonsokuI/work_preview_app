package com.example.demo.controller;

import com.example.demo.dto.theme.ThemeRequest;
import com.example.demo.dto.theme.ThemeResponse;
import com.example.demo.dto.theme.ThemeWithQuestionsResponse;
import com.example.demo.dto.question.QuestionResponse;
import com.example.demo.service.PdfService;
import com.example.demo.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/themes")
@CrossOrigin(origins = "*") // 開発・確認をスムーズにするためにCORSを許可
public class PdfController {

    private final PdfService pdfService;
    private final QuestionService questionService; // 🚀 QuestionServiceを追記

    // コンストラクタにQuestionServiceを追加
    public PdfController(PdfService pdfService, QuestionService questionService) {
        this.pdfService = pdfService;
        this.questionService = questionService;
    }

    /**
     * テーマ一覧取得（紐づく問題一覧も一緒に取得する）
     * URL: http://localhost:8080/api/themes
     */
    @GetMapping
    public List<ThemeWithQuestionsResponse> getThemes() {
        // 1. 全てのテーマ（Pdf）を取得
        List<ThemeResponse> pdfList = pdfService.getAllThemes();

        // 2. 各テーマに紐づく問題をQuestionServiceから取得して、ひとつのデータ構造にまとめる
        return pdfList.stream().map(pdf -> {
            ThemeWithQuestionsResponse response = new ThemeWithQuestionsResponse();
            response.setPdfId(pdf.getPdfId());
            response.setTitle(pdf.getTitle());

            // 🚀 現在のテーマID（Integer）に紐づく問題一覧をServiceから取得
            List<QuestionResponse> questionList = questionService.getQuestionsByTheme(pdf.getPdfId());
            response.setQuestions(questionList);

            return response;
        }).toList();
    }

    /**
     * テーマ作成
     */
    @PostMapping
    public ThemeResponse createTheme(@RequestBody ThemeRequest request) {
        return pdfService.createTheme(request);
    }

    /**
     * テーマ更新
     */
    @PutMapping("/{id}")
    public ThemeResponse updateTheme(
            @PathVariable Integer id,
            @RequestBody ThemeRequest request) {

        return pdfService.updateTheme(id, request);
    }

    /**
     * テーマ削除
     */
    @DeleteMapping("/{id}")
    public void deleteTheme(
            @PathVariable Integer id) {

        pdfService.deleteTheme(id);
    }
}