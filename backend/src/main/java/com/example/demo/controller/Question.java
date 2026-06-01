package com.example.demo.controller;

public class Question {
    private int questionId;
    private int pdfId;
    private String content;

    public Question(int questionId, int pdfId, String content) {
        this.questionId = questionId;
        this.pdfId = pdfId;
        this.content = content;
    }

    // ゲッターとセッター
    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public int getPdfId() {
        return pdfId;
    }

    public void setPdfId(int pdfId) {
        this.pdfId = pdfId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
