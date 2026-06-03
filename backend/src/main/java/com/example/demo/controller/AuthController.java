package com.example.demo.controller;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.entity.User;
import com.example.demo.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = authService.login(
                request.getUserId(),
                request.getPassword());

        LoginResponse response = new LoginResponse();

        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setStatus(user.getStatus());

        return response;
    }

    @PostMapping("/logout")
    public String logout() {
        return "ログアウトしました";
    }
}