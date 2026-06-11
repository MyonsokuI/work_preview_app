const BASE_URL = "http://localhost:8080/api/auth";

export const authApi = {
    /**
     * ユーザーIDとパスワードを送信してログイン認証を行いますにゃ
     * @param {number} EmployeeId
     * @param {string} password 
     * @returns {Promise<Object>} ログインに成功したユーザーデータ (employeeId, name, status)
     */
    login: async (EmployeeId, password) => {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                employeeId: EmployeeId,
                password: password
            }),
        });

        if (!response.ok) {
            throw new Error("ユーザーIDまたはパスワードが違いますにゃ");
        }

        return await response.json();
    }
};