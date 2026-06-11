package com.example.demo.dto.question;

import lombok.Data;
import java.time.LocalDateTime; // 💡 追加

@Data
public class QuestionResponse {
    private Integer questionId;
    private String questionText;
    private String correctAnswer;

    // 💡 フロントにステータスと時間を戻せるように追記にゃ！
    private String status;
    private LocalDateTime openAt;
    private LocalDateTime closeAt;
}