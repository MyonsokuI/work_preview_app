package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // フロントからの接続を許可（CORS対策）
public class AuthController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Map<String, Object> response = new HashMap<>();

        // とりあえず簡易的な判定（後でちゃんとDB連携にする）
        if ("user1".equals(username) && "user123".equals(password)) {
            response.put("status", "success");
            response.put("message", "ログインに成功しました");

            Map<String, Object> data = new HashMap<>();
            data.put("userId", 2);
            data.put("name", "user1");
            data.put("role", "USER");
            response.put("data", data);
        } else {
            response.put("status", "error");
            response.put("message", "ユーザー名またはパスワードが違います");
        }

        return response;
    }
}