package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.QuestionRepository;
import com.example.demo.dto.progress.QuestionProgressDto;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Reactからのアクセスを許可にゃ
public class ProgressController {

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/progress")
    public List<QuestionProgressDto> getProgress() {
        return questionRepository.getQuestionProgressStats();
    }
}
