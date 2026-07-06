package com.example.demo.controller;

import com.example.demo.dto.progress.QuestionProgressDto;
import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class ProgressController {

    private final QuestionRepository questionRepository;

    private final JdbcTemplate jdbcTemplate;

    ProgressController(JdbcTemplate jdbcTemplate, QuestionRepository questionRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.questionRepository = questionRepository;
    }

    @GetMapping("/progress")
    public List<QuestionProgressDto> getProgress() {
        // 🚀 1. DBに登録されている「すべての問題」を愚直に全件取得する！
        // これで追加・編集したばかりの問題も100%漏れなくリストに入ってくる！
        List<Question> allQuestions = questionRepository.findAll();
        List<QuestionProgressDto> resultList = new ArrayList<>();

        for (Question q : allQuestions) {
            QuestionProgressDto dto = new QuestionProgressDto();
            dto.setQuestionId(q.getQuestionId());

            // 💡 2. 未完了の受講生リストをSQLで取得（大文字・小文字のブレもUPPERで防衛！）
            String uncompletedSql = "SELECT u.name FROM users u " +
                    "WHERE UPPER(u.roles) = 'USER' " +
                    "AND u.user_id NOT IN (" +
                    " SELECT a.user_id FROM answers a " +
                    " WHERE a.question_id = ? AND a.user_id IS NOT NULL" +
                    ")";
            List<String> uncompletedUsers = jdbcTemplate.queryForList(uncompletedSql, String.class, q.getQuestionId());
            dto.setUncompletedUsers(uncompletedUsers);

            // 💡 3. 完了した人数をSQLで綺麗に数える！
            String answeredSql = "SELECT COUNT(DISTINCT a.user_id) FROM answers a " +
                    "JOIN users u ON a.user_id = u.user_id " +
                    "WHERE a.question_id = ? AND UPPER(u.roles) = 'USER'";
            Integer answeredCount = jdbcTemplate.queryForObject(answeredSql, Integer.class, q.getQuestionId());
            dto.setAnsweredUserCount(answeredCount != null ? answeredCount : 0);

            // 🚀 【ここが分母の決定打！】
            // 「一般ユーザーの総数」を確実に割り出してDTOに入れる！
            String totalUserSql = "SELECT COUNT(*) FROM users WHERE UPPER(roles) = 'USER'";
            Integer totalCount = jdbcTemplate.queryForObject(totalUserSql, Integer.class);
            dto.setTotalUserCount(totalCount != null ? totalCount : 0);

            resultList.add(dto);
        }

        return resultList;
    }
}