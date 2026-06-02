package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(Integer userId, String password) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        // パスワード確認
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("パスワードが違います");
        }

        return user;
    }
}