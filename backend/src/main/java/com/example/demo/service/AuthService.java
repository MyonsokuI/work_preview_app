package com.example.demo.service;

import com.example.demo.repository.UserRepository;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.entity.User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        Integer userId = request.getUserId();
        String password = request.getPassword();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        // ※本来はBCryptなどで比較（今は簡略化）
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("パスワードが違います");
        }

				LoginResponse response = new LoginResponse();
				response.setUserId(user.getUserId());
				response.setName(user.getName());

        return response;
    }
}