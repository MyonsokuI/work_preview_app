import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/registerApi"; // 💡 共通のauthApiをインポートにゃ！

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        employeeId: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");

    // 入力変更
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // 登録処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // パスワード一致チェック
        if (form.password !== form.confirmPassword) {
            setMessage("パスワードが一致しません");
            return;
        }

        try {
            // 💡 生のfetchを廃止し、共通API関数（registerUser）を呼び出すように変更したにゃ！
            const data = await authApi.registerUser(form.employeeId, form.name, form.password);
            console.log("登録成功:", data);

            // 👉 ログイン画面へ戻る
            navigate("/login");

            // フォームのクリア
            setForm({
                employeeId: "",
                name: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error(err);
            setMessage(err.message || "エラーが発生しましたにゃ");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h2>ユーザー登録</h2>

            <form onSubmit={handleSubmit}>
                {/* ユーザーID */}
                <div>
                    <label>社員ID</label>
                    <input
                        type="number"
                        name="employeeId"
                        value={form.employeeId}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 名前 */}
                <div>
                    <label>名前</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* パスワード */}
                <div>
                    <label>パスワード</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* パスワード確認 */}
                <div>
                    <label>パスワード（確認）</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" style={{ marginTop: "10px" }}>
                    登録
                </button>
            </form>

            {/* メッセージ */}
            {message && (
                <p style={{ marginTop: "10px", color: "red" }}>
                    {message}
                </p>
            )}
        </div>
    );
}