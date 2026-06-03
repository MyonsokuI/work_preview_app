package com.example.demo.controller;

import com.example.demo.dto.theme.ThemeRequest;
import com.example.demo.dto.theme.ThemeResponse;
import com.example.demo.service.PdfService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/themes")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    /**
     * テーマ一覧取得
     */
    @GetMapping
    public List<ThemeResponse> getThemes() {
        return pdfService.getAllThemes();
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