import { useState, useEffect } from "react";

export default function ProgressChecker({ currentTheme }) {
    const [progressList, setProgressList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // 問題ごとに未完了リストを開閉するための状態管理にゃ
    const [openUsersId, setOpenUsersId] = useState({});

    useEffect(() => {
        fetch("http://localhost:8080/api/admin/progress")
            .then((res) => {
                if (!res.ok) throw new Error("進捗データの取得に失敗しましたにゃ");
                return res.json();
            })
            // 🟢 useEffect 内のこの部分を差し替えるにゃ！
            // 🟢 useEffect 内の .then((data) => { ... }) 部分にゃ！
            .then((data) => {
                if (currentTheme && currentTheme.questions && currentTheme.questions.length > 0) {
                    // 現在のテーマに属する問題だけでフィルタリングしつつ、Javaからのデータをガッチャンコするにゃ
                    const combined = currentTheme.questions.map((q) => {
                        // Javaから届いたデータ（data）の中から、一致するquestionIdを探すにゃ
                        const matched = data.find((item) => String(item.questionId) === String(q.questionId));

                        return {
                            questionId: q.questionId,
                            questionText: q.questionText,
                            // 💡 マッチすればJavaの値を使い、追加直後などでマッチしなければ安全に初期値を詰めるにゃ！
                            answeredUserCount: matched ? matched.answeredUserCount : 0,
                            totalUserCount: matched ? matched.totalUserCount : (data[0]?.totalUserCount || 8),
                            uncompletedUsers: matched ? matched.uncompletedUsers : []
                        };
                    });
                    setProgressList(combined);
                } else {
                    setProgressList(data);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("進捗データ読み込みエラー:", err);
                setIsLoading(false);
            });
    }, [currentTheme]);

    // 未完了リストの表示・非表示を切り替える関数にゃ
    const toggleUncompleted = (id) => {
        setOpenUsersId(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (isLoading) {
        return <div style={{ color: "#666", padding: "24px", fontSize: "14px" }}>DBから進捗データを集計中にゃ...</div>;
    }

    if (progressList.length === 0) {
        return (
            <div style={{ color: "#666", padding: "24px", fontSize: "14px", textAlign: "center" }}>
                💡 表示する進捗データがありませんにゃ。
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", fontFamily: "sans-serif" }}>
            <h3 style={{ marginBottom: "20px", color: "#333", borderBottom: "2px solid #28a745", paddingBottom: "8px", fontSize: "18px" }}>
                📊 【問題別進捗】{currentTheme?.title || "全体"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {progressList.map((item) => {
                    const answered = item.answeredUserCount || 0;
                    const total = item.totalUserCount || 0;
                    const rate = total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0;
                    const uncompletedList = item.uncompletedUsers || [];
                    const isOpen = openUsersId[item.questionId];

                    return (
                        <div
                            key={item.questionId}
                            style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                padding: "16px",
                                backgroundColor: "#fff",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                            }}
                        >
                            {/* 上段：問題内容と完了人数 */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "12px" }}>
                                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#1a202c", lineHeight: "1.4" }}>
                                    ID: {item.questionId} | 問: {item.questionText}
                                </div>
                                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#4a5568", whiteSpace: "nowrap" }}>
                                    {answered} / {total} 名完了
                                </div>
                            </div>

                            {/* 中段：プログレスバー */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                <div style={{ flex: 1, backgroundColor: "#edf2f7", borderRadius: "6px", height: "12px", overflow: "hidden" }}>
                                    <div style={{
                                        width: `${rate}%`,
                                        backgroundColor: rate === 100 ? "#28a745" : "#0066cc",
                                        height: "100%",
                                        transition: "width 0.4s ease-out"
                                    }} />
                                </div>
                                <div style={{ fontSize: "14px", fontWeight: "bold", color: rate === 100 ? "#28a745" : "#0066cc", minWidth: "40px", textAlign: "right" }}>
                                    {rate}%
                                </div>
                            </div>

                            {/* 💡 下段：未完了の受講生リスト表示エリア */}
                            {uncompletedList.length > 0 ? (
                                <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
                                    <button
                                        onClick={() => toggleUncompleted(item.questionId)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#e53e3e",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        }}
                                    >
                                        ⚠️ 未完了の受講生 ({uncompletedList.length}名) {isOpen ? "▲ 閉じる" : "▼ 見る"}
                                    </button>

                                    {isOpen && (
                                        <div style={{
                                            marginTop: "8px",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "6px",
                                            backgroundColor: "#fff5f5",
                                            padding: "8px",
                                            borderRadius: "6px"
                                        }}>
                                            {uncompletedList.map((uName, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        backgroundColor: "#feb2b2",
                                                        color: "#9b2c2c",
                                                        fontSize: "12px",
                                                        padding: "2px 8px",
                                                        borderRadius: "4px",
                                                        fontWeight: "500"
                                                    }}
                                                >
                                                    {uName}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "8px", color: "#28a745", fontSize: "12px", fontWeight: "bold" }}>
                                    ✨ 全員完了にゃ！
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}