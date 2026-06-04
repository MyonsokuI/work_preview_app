package com.example.demo.controller;

import com.example.demo.dto.user.UserResponse;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * ユーザー一覧取得
     */
    @GetMapping
    public List<UserResponse> getUsers() {
        return userService.getAllUsers();
    }

    /**
     * 指定されたIDのユーザーを取得
     */
    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Integer id) {
        return userService.getUser(id);
    }
}