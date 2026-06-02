package com.example.demo.service;

import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String name, String password) {

        User user = userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        // ※本来はBCryptなどで比較（今は簡略化）
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("パスワードが違います");
        }

        return user;
    }
}