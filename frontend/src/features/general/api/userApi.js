const BASE_URL = "http://localhost:8080/api";

// ヘルパー関数：Authorization ヘッダーを取得
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
    };
};

export const userApi = {
    /**
     * 1. 全てのテーマとそれに紐づく問題の一覧を取得するにゃ
     */
    getThemes: async () => {
        const res = await fetch(`${BASE_URL}/themes`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("テーマ一覧の取得に失敗しましたにゃ");
        return await res.json();
    },

    /**
     * 2. 自分の回答一覧を取得するにゃ
     */
    getMyAnswers: async (userId) => {
        const res = await fetch(`${BASE_URL}/answers/my?userId=${userId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("自分の回答データの取得に失敗しましたにゃ");
        return await res.json();
    },

    /**
     * 3. 回答を新規登録・更新（共通upsert）するにゃ
     */
    upsertAnswer: async (userId, questionId, content, imagePath = null) => {
        const res = await fetch(`${BASE_URL}/answers/upsert?userId=${userId}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                questionId: questionId,
                answerContent: content,
                imagePath: imagePath || null,
            }),
        });
        if (!res.ok) throw new Error("回答の保存に失敗しましたにゃ");
        return await res.json();
    },

    /**
     * 4. 特定の問題に対する「他の受講者全員」の回答一覧を取得するにゃ
     */
    getOtherAnswers: async (questionId) => {
        const res = await fetch(`${BASE_URL}/questions/${questionId}/answers`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("他の受講者の回答取得に失敗しましたにゃ");
        return await res.json();
    }
};