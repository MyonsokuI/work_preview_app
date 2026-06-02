package com.example.demo.controller;

import com.example.demo.entity.Pdf;
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
    public List<Pdf> getThemes() {
        return pdfService.getAllThemes();
    }

    /**
     * テーマ作成
     */
    @PostMapping
    public Pdf createTheme(@RequestBody Pdf pdf) {
        return pdfService.createTheme(pdf);
    }

    /**
     * テーマ更新
     */
    @PutMapping("/{id}")
    public Pdf updateTheme(
            @PathVariable Integer id,
            @RequestBody Pdf pdf) {

        return pdfService.updateTheme(id, pdf);
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