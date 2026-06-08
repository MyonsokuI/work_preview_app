const BASE_URL = "http://localhost:8080/api";

export const authApi = {
    /**
     * 新しい受講生ユーザーを登録するにゃ
     */
    registerUser: async (userId, name, password) => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: Number(userId),
                name,
                password,
            }),
        });

        if (!res.ok) {
            throw new Error("登録に失敗しましたにゃ");
        }

        return await res.json();
    },
};