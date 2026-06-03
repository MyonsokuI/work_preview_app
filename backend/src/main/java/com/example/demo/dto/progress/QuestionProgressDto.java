package com.example.demo.dto.progress;

public class QuestionProgressDto {
    private Integer questionId;
    private String questionText;
    private Long answeredUserCount; // 💡 この問題を解いたユニークな人数
    private Long totalUserCount; // 💡 システム全体の総ユーザー数（分母）

    public QuestionProgressDto(Integer questionId, String questionText, Long answeredUserCount, Long totalUserCount) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.answeredUserCount = answeredUserCount;
        this.totalUserCount = totalUserCount;
    }

    // ゲッター・セッター（必須にゃ！）
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

    public Long getAnsweredUserCount() {
        return answeredUserCount;
    }

    public void setAnsweredUserCount(Long answeredUserCount) {
        this.answeredUserCount = answeredUserCount;
    }

    public Long getTotalUserCount() {
        return totalUserCount;
    }

    public void setTotalUserCount(Long totalUserCount) {
        this.totalUserCount = totalUserCount;
    }
}
