// package com.example.demo.controller;

// import com.example.demo.entity.Pdf;
// import com.example.demo.entity.Question;
// import com.example.demo.service.PdfService;
// import com.example.demo.service.QuestionService;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/themes")
// @CrossOrigin(origins = "*") // 開発・確認をスムーズにするためにCORSを許可
// public class PdfController {

//     private final PdfService pdfService;
//     private final QuestionService questionService; // 🚀 QuestionServiceを追記

//     // コンストラクタにQuestionServiceを追加
//     public PdfController(PdfService pdfService, QuestionService questionService) {
//         this.pdfService = pdfService;
//         this.questionService = questionService;
//     }

//     /**
//      * テーマ一覧取得（紐づく問題一覧も一緒に取得する）
//      * URL: http://localhost:8080/api/themes
//      */
//     @GetMapping
//     public List<Map<String, Object>> getThemes() {
//         // 1. 全てのテーマ（Pdf）を取得
//         List<Pdf> pdfList = pdfService.getAllThemes();

//         // 2. 各テーマに紐づく問題をQuestionServiceから取得して、ひとつのデータ構造にまとめる
//         return pdfList.stream().map(pdf -> {
//             Map<String, Object> themeMap = new HashMap<>();
//             themeMap.put("pdfId", pdf.getPdfId());
//             themeMap.put("title", pdf.getTitle());

//             // 🚀 現在のテーマID（Integer）に紐づく問題一覧をServiceから取得
//             List<Question> questionList = questionService.getQuestionsByTheme(pdf.getPdfId());

//             // 画面で見やすいように必要な項目（ID、問題文、正解）だけをMapに詰める
//             List<Map<String, Object>> questionData = questionList.stream().map(q -> {
//                 Map<String, Object> qMap = new HashMap<>();
//                 qMap.put("questionId", q.getQuestionId());
//                 qMap.put("questionText", q.getQuestionText());
//                 qMap.put("correctAnswer", q.getCorrectAnswer());
//                 return qMap;
//             }).collect(Collectors.toList());

//             // テーマのデータの中に、問題一覧を配列として追加
//             themeMap.put("questions", questionData);
//             return themeMap;
//         }).collect(Collectors.toList());
//     }

//     /**
//      * テーマ作成
//      */
//     @PostMapping
//     public Pdf createTheme(@RequestBody Pdf pdf) {
//         return pdfService.createTheme(pdf);
//     }

//     /**
//      * テーマ更新
//      */
//     @PutMapping("/{id}")
//     public Pdf updateTheme(
//             @PathVariable Integer id,
//             @RequestBody Pdf pdf) {

//         return pdfService.updateTheme(id, pdf);
//     }

//     /**
//      * テーマ削除
//      */
//     @DeleteMapping("/{id}")
//     public void deleteTheme(
//             @PathVariable Integer id) {

//         pdfService.deleteTheme(id);
//     }
// }