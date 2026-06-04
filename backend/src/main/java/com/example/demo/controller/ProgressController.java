package com.example.demo.controller;

import com.example.demo.dto.progress.QuestionProgressDto;
import com.example.demo.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate; // 💡 確実な引き算のために使うにゃ
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate; // 💡 自動注入にゃ！

    @GetMapping("/progress")
    public List<QuestionProgressDto> getProgress() {
        // 1. さっき成功した「進捗率」のリストをそのまま取得するにゃ
        List<QuestionProgressDto> statsList = questionRepository.getQuestionProgressStats();

        // 2. 取得したリストをループで回して、「未完了の人の名前」を裏から詰めるにゃ！
        for (QuestionProgressDto stats : statsList) {

            // 💡 SQLの解説:
            // 一般ユーザー(status='USER')の中で、
            // 「answersテーブルに、このquestion_idで解答を記録していない人」の名前(name)を全件抜くにゃ。
            String sql = "SELECT u.name FROM users u " +
                    "WHERE u.status = 'USER' " +
                    "AND u.user_id NOT IN (" +
                    " SELECT a.user_id FROM answers a " +
                    " WHERE a.question_id = ? AND a.user_id IS NOT NULL" +
                    ")";

            // SQLを実行して、まだ解いていない人の名前のリストを取得にゃ
            List<String> uncompletedNames = jdbcTemplate.queryForList(sql, String.class,
                    stats.getQuestionId());

            // DTOにリストをセットするにゃ
            stats.setUncompletedUsers(uncompletedNames);
        }

        return statsList;
    }
}