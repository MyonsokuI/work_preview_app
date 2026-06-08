import { useState } from "react";
import { adminApi } from "../api/adminApi";

export default function AdminSidebar({
    themes,
    activeQuestionId,
    activeTab,
    onSelectQuestion,
    onAddQuestion, // 💡 親（AdminConsole）の handleStartAddQuestion を呼び出すにゃ
    onAddTheme,
    onDeleteTheme,
    onUpdateTheme,
    onLogout,
    onDeleteQuestion
}) {
    // --- テーマ用のState ---
    const [newThemeTitle, setNewThemeTitle] = useState("");
    const [openAt, setOpenAt] = useState("");
    const [closeAt, setCloseAt] = useState("");
    const [status, setStatus] = useState("draft");
    const [showAddForm, setShowAddForm] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    // 🟢 テーマ追加
    const handleSubmitTheme = async (e) => {
        e.preventDefault();
        if (!newThemeTitle.trim()) return;

        try {
            const themeParams = {
                title: newThemeTitle.trim(),
                status: status,
                openAt: openAt ? openAt + ":00" : null,
                closeAt: closeAt ? closeAt + ":00" : null
            };

            const savedPdf = await adminApi.createTheme(themeParams);

            onAddTheme({
                pdfId: savedPdf.pdfId,
                title: savedPdf.title,
                status: savedPdf.status,
                openAt: savedPdf.openAt,
                closeAt: savedPdf.closeAt,
                questions: []
            });

            setNewThemeTitle("");
            setOpenAt("");
            setCloseAt("");
            setStatus("draft");
            setShowAddForm(false);
            alert("テーマを公開設定付きで登録しましたにゃ！🐾");
        } catch (error) {
            console.error("テーマ作成に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    // 検索・フィルタリングロジック
    const filteredThemes = (themes || []).filter((theme) => {
        if (!theme || !theme.title) return false;
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        const matchesTheme = theme.title.toLowerCase().includes(query);
        const matchesQuestions = (theme.questions || []).some((q) =>
            q && q.questionText && q.questionText.toLowerCase().includes(query)
        );

        return matchesTheme || matchesQuestions;
    });

    return (
        <div style={{ width: "300px", borderRight: "1px solid #ccc", padding: "16px", backgroundColor: "#f8f9fa", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", height: "100vh", boxSizing: "border-box" }}>

            {/* 🚪 ログアウトエリア */}
            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: "#555" }}>管理者フォーム</h3>
                <button onClick={onLogout} style={{ padding: "6px 12px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
                    ログアウト
                </button>
            </div>

            {/* 🔍 検索ボックス */}
            <div>
                <input
                    type="text"
                    placeholder="🔍 テーマ・問題文から検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                />
            </div>

            {/* ➕ 新テーマ追加セクション */}
            <div style={{ border: "1px solid #e2e8f0", padding: "10px", borderRadius: "6px", backgroundColor: "#fff" }}>
                {!showAddForm ? (
                    <button
                        onClick={() => setShowAddForm(true)}
                        style={{ width: "100%", padding: "8px", backgroundColor: "#0066cc", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                    >
                        ➕ 新しいテーマを作成する
                    </button>
                ) : (
                    <form onSubmit={handleSubmitTheme} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "12px", color: "#333" }}>新規テーマ登録</div>

                        <input
                            type="text"
                            placeholder="テーマ名（必須）"
                            value={newThemeTitle}
                            onChange={(e) => setNewThemeTitle(e.target.value)}
                            style={{ padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            required
                        />

                        <label style={{ fontSize: "11px", color: "#666", display: "flex", flexDirection: "column", gap: "2px" }}>
                            公開ステータス:
                            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "4px", fontSize: "12px" }}>
                                <option value="draft">未公開 (draft)</option>
                                <option value="published">公開 (published/scheduled)</option>
                            </select>
                        </label>

                        <label style={{ fontSize: "11px", color: "#666", display: "flex", flexDirection: "column", gap: "2px" }}>
                            公開開始日時:
                            <input type="datetime-local" value={openAt} onChange={(e) => setOpenAt(e.target.value)} style={{ padding: "4px", fontSize: "12px" }} />
                        </label>

                        <label style={{ fontSize: "11px", color: "#666", display: "flex", flexDirection: "column", gap: "2px" }}>
                            公開終了日時:
                            <input type="datetime-local" value={closeAt} onChange={(e) => setCloseAt(e.target.value)} style={{ padding: "4px", fontSize: "12px" }} />
                        </label>

                        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                            <button type="submit" style={{ flex: 1, padding: "6px", fontSize: "12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                                テーマを新規作成
                            </button>
                            <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: "6px", fontSize: "12px", backgroundColor: "#e2e8f0", color: "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                                キャンセル
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* テーマ・問題リスト表示エリア */}
            <div style={{ flex: 1 }}>
                {filteredThemes.map((theme) => (
                    <div key={theme.pdfId} style={{ marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>

                        {/* テーマタイトル部分 */}
                        <div
                            style={{ fontWeight: "bold", fontSize: "14px", padding: "6px 0", color: "#111", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            onClick={() => onSelectQuestion(theme.pdfId, null, "progress")}
                        >
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
                                ▼ {theme.title}
                            </span>
                            <span style={{
                                fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontWeight: "600",
                                backgroundColor: theme.status === "published" ? "#d1fae5" : theme.status === "scheduled" ? "#fef3c7" : "#e2e8f0",
                                color: theme.status === "published" ? "#065f46" : theme.status === "scheduled" ? "#92400e" : "#374151"
                            }}>
                                {theme.status || "draft"}
                            </span>
                        </div>

                        {/* 問題の一覧リスト */}
                        <div style={{ marginLeft: "12px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            {(theme.questions || []).map((q) => (
                                <div
                                    key={q.questionId}
                                    onClick={() => onSelectQuestion(theme.pdfId, q.questionId, "edit")}
                                    style={{
                                        fontSize: "12px", padding: "6px 8px", borderRadius: "4px", cursor: "pointer",
                                        backgroundColor: activeQuestionId === q.questionId && activeTab === "edit" ? "#e0f2fe" : "transparent",
                                        color: activeQuestionId === q.questionId && activeTab === "edit" ? "#0369a1" : "#475569",
                                        display: "flex", justifyContent: "space-between", alignItems: "center"
                                    }}
                                >
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
                                        ❓ {q.questionText || "問題文未入力"}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("この問題を削除してもよろしいですかにゃ？")) {
                                                adminApi.deleteQuestion(q.questionId)
                                                    .then(() => onDeleteQuestion(theme.pdfId, q.questionId))
                                                    .catch(err => alert("削除に失敗しました: " + err.message));
                                            }
                                        }}
                                        style={{ border: "none", backgroundColor: "transparent", color: "#ef4444", cursor: "pointer", fontSize: "11px", padding: "2px" }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            {/* 💡 【仕様変更後】押した瞬間右側にフォームを開くシンプルなボタンにゃ！ */}
                            <button
                                onClick={() => onAddQuestion(theme.pdfId)}
                                style={{
                                    marginTop: "6px", padding: "6px 8px", fontSize: "11px",
                                    backgroundColor: "#f1f5f9", border: "1px dashed #cbd5e1",
                                    borderRadius: "4px", cursor: "pointer", color: "#64748b", textAlign: "left"
                                }}
                            >
                                ➕ 新しい問題を追加
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}