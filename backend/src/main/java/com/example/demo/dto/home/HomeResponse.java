package com.example.demo.dto.home;

import java.util.List;

import com.example.demo.dto.answer.AnswerResponse;
import com.example.demo.dto.theme.ThemeResponse;

import lombok.Data;

@Data
public class HomeResponse {
    private List<ThemeResponse> themes;
    private List<AnswerResponse> recentAnswers;
}