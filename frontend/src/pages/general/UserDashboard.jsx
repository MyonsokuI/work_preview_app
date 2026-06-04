import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // ローカルストレージからログイン情報を復元するにゃ
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // もしログインしてないのにこのURLを直打ちされたらログイン画面に強制送還にゃ！
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        alert("ログアウトしましたにゃ！");
        navigate("/login");
    };

    if (!user) return <div style={{ padding: "20px" }}>読み込み中だにゃ...</div>;

    return (
        <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #00cc66", paddingBottom: "16px", marginBottom: "24px" }}>
                <h2>📖 受講者ダッシュボード</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span>ようこそ、<strong>{user.name}</strong> さん（一般ユーザー）</span>
                    <button onClick={handleLogout} style={{ padding: "6px 12px", backgroundColor: "#ff4d4d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>ログアウト</button>
                </div>
            </div>

            <div style={{ padding: "24px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #eee" }}>
                <h3>✨ 本日の学習内容</h3>
                <p>ここにスライドの一覧や、問題に回答する機能を今後繋ぎこんでいくのニャ！</p>
            </div>
        </div>
    );
}