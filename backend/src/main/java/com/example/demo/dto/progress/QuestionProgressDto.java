package com.example.demo.dto.progress;

import java.util.List;

public class QuestionProgressDto {
    private Integer questionId;
    private String questionText;
    private long answeredUserCount;
    private long totalUserCount;
    private List<String> uncompletedUsers;

    // 🚀 【これが足りなかった！】デフォルトコンストラクタを追加
    public QuestionProgressDto() {
    }

    // ★JPQLの「SELECT new ...」に対応するコンストラクタ（残しておいて安全）
    public QuestionProgressDto(Integer questionId, long answeredUserCount) {
        this.questionId = questionId;
        this.answeredUserCount = answeredUserCount;
    }

    // 既存の引数4つのコンストラクタ
    public QuestionProgressDto(Integer questionId, String questionText, long answeredUserCount, long totalUserCount) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.answeredUserCount = answeredUserCount;
        this.totalUserCount = totalUserCount;
    }

    // 💡 ゲッターとセッター（変更なし）
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

    public List<String> getUncompletedUsers() {
        return uncompletedUsers;
    }

    public void setUncompletedUsers(List<String> uncompletedUsers) {
        this.uncompletedUsers = uncompletedUsers;
    }
}