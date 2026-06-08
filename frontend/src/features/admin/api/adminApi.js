// src/services/adminApi.js
const BASE_URL = "http://localhost:8080/api";

export const adminApi = {
    // --- テーマ (Themes) 関連 ---
    async getThemes() {
        const response = await fetch(`${BASE_URL}/themes`);
        if (!response.ok) throw new Error("テーマの一覧取得に失敗しました");
        return response.json();
    },

    // 💡 拡張：引数をオブジェクト (themeData) で受け取るように変更にゃ！
    // themeData の中身のイメージ： { title, status, openAt, closeAt }
    async createTheme(themeData) {
        const response = await fetch(`${BASE_URL}/themes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Java側の ThemeRequest にそのままマッピングできるようにJSON化するにゃ🐾
            body: JSON.stringify(themeData),
        });
        if (!response.ok) throw new Error("テーマの作成に失敗しました");
        return response.json();
    },

    // 💡 拡張：更新時もタイトルだけでなく、時間やステータスもまとめて更新できるように変更にゃ！
    // themeData の中身のイメージ： { title, status, openAt, closeAt }
    async updateTheme(themeId, themeData) {
        const response = await fetch(`${BASE_URL}/themes/${themeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(themeData),
        });
        if (!response.ok) throw new Error("テーマの更新に失敗しました");
        return response.json();
    },

    async deleteTheme(themeId) {
        const response = await fetch(`${BASE_URL}/themes/${themeId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("テーマの削除に失敗しました");
        return response.ok;
    },

    // --- 問題 (Questions) 関連 ---
    async createQuestion(themeId, questionText = "新しい問題内容", correctAnswer = "模範解答") {
        const response = await fetch(`${BASE_URL}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdfId: themeId, questionText, correctAnswer }),
        });
        if (!response.ok) throw new Error("問題の作成に失敗しました");
        return response.json();
    },

    async updateQuestion(questionId, { questionText, correctAnswer, pdfId }) {
        const response = await fetch(`${BASE_URL}/questions/${questionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionText, correctAnswer, pdfId }),
        });
        if (!response.ok) throw new Error("問題の更新に失敗しました");
        return response.json();
    },

    async deleteQuestion(questionId) {
        const response = await fetch(`${BASE_URL}/questions/${questionId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("問題の削除に失敗しました");
        return response.ok;
    },

    // --- 進捗 (Progress) 関連 ---
    async getProgress() {
        const response = await fetch(`${BASE_URL}/admin/progress`);
        if (!response.ok) throw new Error("進捗データの取得に失敗しました");
        return response.json();
    }
};