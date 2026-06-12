package com.example.demo.service;

import com.example.demo.repository.UserRepository;
import com.example.demo.dto.user.UserRequest;
import com.example.demo.dto.user.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.entity.enums.Role;
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
                    res.setRole(user.getRoles());
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
        res.setRole(user.getRoles());

        return res;
    }

    // ユーザー登録
    public UserResponse createUser(UserRequest req) {

        if (userRepository.existsById(req.getUserId())) {
            throw new BusinessException("ID重複");
        }

        User user = new User();
        user.setUserId(req.getUserId());
        user.setName(req.getName());
        user.setPassword(req.getPassword());
        user.setRoles(Role.USER);

        User saved = userRepository.save(user);

        // Entity → Response に変換
        UserResponse res = new UserResponse();
        res.setUserId(saved.getUserId());
        res.setName(saved.getName());
        res.setRole(saved.getRoles());

        return res;
    }
}