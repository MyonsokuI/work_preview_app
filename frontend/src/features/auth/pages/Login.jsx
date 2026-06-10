import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/loginApi"; // 💡 共通API関数をインポートするにゃ！
import { jwtDecode } from "jwt-decode"; // 💡 JWTトークンのデコードに使用するライブラリをインポートするにゃ！

export default function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // 💡 共通API関数に置き換えて、生のfetchを隠蔽したにゃ！
            // 💡 入力された文字列の userId をここで数値型に変換して渡すにゃ
            const { token } = await authApi.login(Number(userId), password);

            // 💡 ログイン情報をブラウザのローカルストレージに保存
            localStorage.setItem("token", token);
            const decoded = jwtDecode(token);
            const currentUserObject = {
                userId: decoded.sub ? Number(decoded.sub) : null, // 🌟 subから取り出して、数値に変換するにゃ！
                name: decoded.name,
                role: decoded.role,
            };

            localStorage.setItem("currentUser", JSON.stringify(currentUserObject)); // 💡 ユーザー情報をオブジェクトとして保存するにゃ！

            const role = decoded.role; // 💡 デコードした情報からユーザーの役割（role）を取得するに
            const name = decoded.name; // 💡 デコードした情報からユーザーの名前を取得するに
            // 🌟 運命の権限（status）分岐処理にゃ！
            if (role === "ADMIN") {
                alert(`管理者：${name} さんとしてログインしましたにゃ！`);
                navigate("/admin/console");
            } else if (role === "USER") {
                alert(`受講者：${name} さんとしてログインしましたにゃ！`);
                navigate("/user/dashboard");
            } else {
                alert("このアカウントは現在利用できませんにゃ（INACTIVEなど）");
            }

        } catch (error) {
            console.error("ログインエラーにゃ:", error);
            alert(error.message); // API側から投げられた「ユーザーIDまたはパスワードが〜」のエラーメッセージが表示されるにゃ
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

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {/* 🚀 💡 【新機能】ここから新規登録画面への遷移ボタンエリアにゃ！ */}
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #eee", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px", marginTop: 0 }}>はじめて利用する方はこちら 🐾</p>
                <button
                    type="button" // ⚠️ これを省略するとformの一部と判定されて勝プーンとサブミットしちゃうから必須にゃ！
                    onClick={() => navigate("/user/register")} // 💡 指定されたURLへシュッと遷移するにゃ！
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#fff",
                        color: "#0066cc",
                        border: "1px solid #0066cc",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "14px",
                        transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#f0f7ff";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#fff";
                    }}
                >
                    ✨ 新規アカウント登録
                </button>
            </div>
        </div>
    );
}