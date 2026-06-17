const BASE_URL = "http://localhost:8080/api";

export const authApi = {
    registerUser: async (employeeId, name, password) => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                employeeId: Number(employeeId),
                name,
                password,
            }),
        });

        // レスポンスが正常でない場合
        if (!res.ok) {

            // バックエンドから返されたエラー情報を取得
            const errorData = await res.json();

            // 開発用ログ
            console.error("登録エラー:", errorData);

            // エラーメッセージを生成
            // ① BusinessExceptionなら errorData.message
            // ② Validationエラーなら Object.values(errorData)[0]
            // ③ どちらも無ければデフォルトメッセージ
            throw new Error(
                errorData.message ||
                Object.values(errorData)[0] ||
                "登録に失敗しました"
            );
        }

        // 登録成功時は作成されたユーザー情報を返却
        return await res.json();
    },
};