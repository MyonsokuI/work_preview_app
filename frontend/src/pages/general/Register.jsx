import { useState } from "react";

export default function Register() {
    const [form, setForm] = useState({
        userId: "",
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
            const res = await fetch("http://localhost:8080/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: Number(form.userId),
                    name: form.name,
                    password: form.password,
                }),
            });

            if (!res.ok) {
                throw new Error("登録に失敗しました");
            }

            const data = await res.json();
            console.log("登録成功:", data);

            setMessage("登録成功しました");

            // クリア
            setForm({
                userId: "",
                name: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error(err);
            setMessage("エラーが発生しました");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h2>ユーザー登録</h2>

            <form onSubmit={handleSubmit}>
                {/* ユーザーID */}
                <div>
                    <label>ユーザーID</label>
                    <input
                        type="number"
                        name="userId"
                        value={form.userId}
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