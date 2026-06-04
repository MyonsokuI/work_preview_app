import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: Number(userId),
                    password: password
                }),
            });

            if (!response.ok) {
                throw new Error("ユーザーIDまたはパスワードが違いますにゃ");
            }

            // Java側の LoginResponse (userId, name, status) を受け取るにゃ
            const userData = await response.json();

            // 💡 ログイン情報をブラウザのローカルストレージに保存（他画面で名前などを出すため）
            localStorage.setItem("currentUser", JSON.stringify(userData));

            // 🌟 運命の権限（status）分岐処理にゃ！
            if (userData.status === "ADMIN") {
                alert(`管理者：${userData.name} さんとしてログインしましたにゃ！`);
                navigate("/admin/console"); // 👈 さっきまで直してた管理者画面へ！
            } else if (userData.status === "USER") {
                alert(`受講者：${userData.name} さんとしてログインしましたにゃ！`);
                navigate("/user/dashboard"); // 👈 一般ユーザ用の画面へ！
            } else {
                alert("このアカウントは現在利用できませんにゃ（INACTIVEなど）");
            }

        } catch (error) {
            console.error("ログインエラーにゃ:", error);
            alert(error.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "100px auto", padding: "32px", border: "1px solid #e0e0e0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontFamily: "sans-serif", backgroundColor: "#fff" }}>
            <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#333" }}>🔑 ログイン</h2>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "14px", color: "#555" }}>ユーザーID（半角数字）</label>
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        placeholder="例: 1"
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
                    />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "14px", color: "#555" }}>パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="パスワードを入力"
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
                    />
                </div>
                <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#0066cc", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", transition: "background-color 0.2s" }}>
                    ログインするにゃ
                </button>
            </form>
        </div>
    );
}