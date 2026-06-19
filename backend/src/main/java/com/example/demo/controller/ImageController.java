package com.example.demo.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ImageController {
    @PostMapping("/upload/question")
    public ResponseEntity<String> uploadQuestionImage(@RequestParam("file") MultipartFile file) {
        try {
            // 1. 日時フォーマットを作成（例: 20260618_143005）
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

            // 2. 元の拡張子を取得（例: .png）
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // 3. ファイル名を結合
            String fileName = timestamp + extension;

            // 4. 保存先と保存処理（以下同じ）
            Path uploadPath = Paths.get("uploads/");
            if (!Files.exists(uploadPath))
                Files.createDirectories(uploadPath);

            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

            return ResponseEntity.ok("/images/" + fileName);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("アップロード失敗");
        }
    }

    @PostMapping("/upload/answer")
    public ResponseEntity<String> uploadAnswerImage(@RequestParam("file") MultipartFile file) {
        try {
            // 問題画像と同じロジックで、日時ベースのファイル名に統一
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = timestamp + extension;

            Path uploadPath = Paths.get("uploads/");
            if (!Files.exists(uploadPath))
                Files.createDirectories(uploadPath);

            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

            return ResponseEntity.ok("/images/" + fileName);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("アップロード失敗");
        }
    }
}
