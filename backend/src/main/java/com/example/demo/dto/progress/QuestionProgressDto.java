package com.example.demo.dto.progress;

import java.util.List;

public class QuestionProgressDto {
    private Integer questionId;
    private String questionText;
    private long answeredUserCount;
    private long totalUserCount;
    // 💡 このフィールドを追加にゃ！
    private List<String> uncompletedUsers;

    // コンストラクタ（既存の「SELECT new ...」の邪魔をしないように、引数4つのものはそのまま残すにゃ）
    public QuestionProgressDto(Integer questionId, String questionText, long answeredUserCount, long totalUserCount) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.answeredUserCount = answeredUserCount;
        this.totalUserCount = totalUserCount;
    }

    // 💡 ゲッターとセッターを追加してにゃ
    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public long getAnsweredUserCount() {
        return answeredUserCount;
    }

    public void setAnsweredUserCount(long answeredUserCount) {
        this.answeredUserCount = answeredUserCount;
    }

    public long getTotalUserCount() {
        return totalUserCount;
    }

    public void setTotalUserCount(long totalUserCount) {
        this.totalUserCount = totalUserCount;
    }

    // 💡 未完了リスト用のゲッター・セッターにゃ
    public List<String> getUncompletedUsers() {
        return uncompletedUsers;
    }

    public void setUncompletedUsers(List<String> uncompletedUsers) {
        this.uncompletedUsers = uncompletedUsers;
    }
}