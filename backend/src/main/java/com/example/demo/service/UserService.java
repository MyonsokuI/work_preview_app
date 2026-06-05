package com.example.demo.service;

import com.example.demo.repository.UserRepository;
import com.example.demo.dto.user.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.exception.BusinessException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> {
                    UserResponse res = new UserResponse();
                    res.setUserId(user.getUserId());
                    res.setName(user.getName());
                    res.setStatus(user.getStatus());
                    return res;
                })
                .toList();
    }

    public UserResponse getUser(Integer id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("ユーザーが見つかりません"));

        UserResponse res = new UserResponse();
        res.setUserId(user.getUserId());
        res.setName(user.getName());
        res.setStatus(user.getStatus());

        return res;
    }
}