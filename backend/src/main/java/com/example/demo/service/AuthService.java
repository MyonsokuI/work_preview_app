package com.example.demo.service;

import com.example.demo.repository.UserRepository;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.entity.User;
import com.example.demo.exception.BusinessException;
import com.example.demo.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        Integer userId = request.getUserId();
        String password = request.getPassword();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("ユーザーが見つかりません"));

        // パスワード確認
        if (!user.getPassword().equals(password)) {
            throw new BusinessException("パスワードが違います");
        }

        // JWT生成
        String token = jwtUtil.generateToken(user.getUserId(), user.getRole(), user.getName());

        LoginResponse response = new LoginResponse();
        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setToken(token);

        return response;
    }
}