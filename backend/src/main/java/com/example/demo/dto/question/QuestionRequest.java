package com.example.demo.dto.question;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime; // 💡 追加

@Getter
@Setter
public class QuestionRequest {
    @NotNull(message = "PDF IDは必須です")
    private Integer pdfId;

    @NotBlank(message = "質問内容は必須です")
    @Size(max = 1000, message = "質問内容は1000文字以内で入力してください")
    private String questionText;

    @NotBlank(message = "正解は必須です")
    private String correctAnswer;

    // 💡 フロントからステータスと公開・終了時間を受け取れるように追記にゃ！
    private String status;
    private LocalDateTime openAt;
    private LocalDateTime closeAt;
    private String imagePath;
}