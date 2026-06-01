package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/themes")
@CrossOrigin(origins = "*")
public class ThemeController {

    @GetMapping
    public List<Theme> getThemes() {

        return List.of(
                new Theme(1, "Java基礎"),
                new Theme(2, "Spring Boot基礎"),
                new Theme(3, "SQL基礎"));
    }

    // クラスの上の @CrossOrigin(origins = "*") を確認しておいてね！

    @GetMapping("/{themeId}/questions")
    public List<Question> getQuestionsByTheme(@PathVariable int themeId) {
        // 本来はDBから取得するが、一旦themeIdに応じてダミーデータを切り替える
        if (themeId == 1) { // Java基礎
            return List.of(
                    new Question(101, 1, "Javaとは何ですか？"),
                    new Question(102, 1, "変数と定数の違いを説明してください。"));
        } else if (themeId == 2) { // Spring Boot基礎
            return List.of(
                    new Question(201, 2, "Spring BootにおけるControllerの役割は？"),
                    new Question(202, 2, "@RestControllerとは何ですか？"));
        } else { // その他（SQL基礎など）
            return List.of(
                    new Question(301, 3, "SELECT文の基本構成を書いてください。"),
                    new Question(302, 3, "PRIMARY KEY（主キー）の役割とは？"));
        }
    }
}
