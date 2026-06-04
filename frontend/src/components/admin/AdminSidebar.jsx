import { useState } from "react";

export default function AdminSidebar({
    themes,
    activeQuestionId,
    activeTab,
    onSelectQuestion,
    onAddQuestion,
    onAddTheme,
    onDeleteTheme,
    onUpdateTheme,
    onLogout // 💡 ここを onShowProgress から onLogout に修正したにゃ！
}) {
    const [newThemeName, setNewThemeName] = useState("");

    // 🟢 テーマ追加の処理（API通信連携版）
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newThemeName.trim()) return;

        try {
            const response = await fetch("http://localhost:8080/api/themes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newThemeName.trim() }),
            });

            if (!response.ok) throw new Error("テーマの作成に失敗しました");

            const savedPdf = await response.json();

            onAddTheme({
                pdfId: savedPdf.pdfId,
                title: savedPdf.title,
                questions: []
            });

            setNewThemeName("");
        } catch (error) {
            console.error("テーマ作成APIの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    // 🔴 テーマ削除の処理
    const handleDelete = async (e, themeId) => {
        e.stopPropagation();

        if (!window.confirm("このテーマを削除してもよろしいですか？\n※紐づく問題もすべて削除されます。")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/themes/${themeId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onDeleteTheme(themeId);
            } else {
                alert("削除に失敗しました。");
            }
        } catch (error) {
            console.error("テーマ削除APIとの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    // 🟡 テーマ編集の処理
    const handleEdit = async (e, themeId, currentTitle) => {
        e.stopPropagation();

        const newName = window.prompt("新しいテーマ名を入力してください：", currentTitle);
        if (newName === null || !newName.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/api/themes/${themeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: newName.trim()
                }),
            });

            if (!response.ok) throw new Error("テーマ名の更新に失敗しました");

            const updatedPdf = await response.json();
            onUpdateTheme(themeId, updatedPdf.title);
        } catch (error) {
            console.error("テーマ更新APIとの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    return (
        <div style={{ width: "300px", borderRight: "1px solid #ccc", padding: "16px", backgroundColor: "#f8f9fa", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* 🚪 ログアウトボタン配置エリアにゃ！ */}
            <div style={{
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: "#555" }}>管理者フォーム</h3>
                <button
                    onClick={onLogout}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#e2e8f0", // 💡 編集ボタンに近い、落ち着いた薄いグレーにゃ
                        color: "#4a5568",           // 💡 文字色もダークグレーでなじませるにゃ
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "12px",
                        transition: "background-color 0.2s"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#cbd5e1"} // 💡 ホバー時は少し濃いグレーに
                    onMouseOut={(e) => e.target.style.backgroundColor = "#e2e8f0"}
                >
                    ログアウト
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: "4px", display: "flex", gap: "4px" }}>
                <input
                    type="text"
                    placeholder="新テーマ名"
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    style={{ flex: 1, padding: "6px", fontSize: "12px" }}
                />
                <button type="submit" style={{ padding: "6px 10px", fontSize: "12px", cursor: "pointer" }}>追加</button>
            </form>

            <div style={{ flex: 1 }}>
                {themes.map((theme) => (
                    <div key={theme.pdfId} style={{ marginBottom: "16px" }}>
                        <div
                            style={{ fontWeight: "bold", fontSize: "14px", padding: "4px 0", color: "#111", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                            onClick={() => onSelectQuestion(theme.pdfId, null, "progress")}
                        >
                            <span>▼ {theme.title}</span>
                            <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                                <button
                                    onClick={(e) => handleEdit(e, theme.pdfId, theme.title)}
                                    style={{ padding: "3px 6px", fontSize: "11px", backgroundColor: "#e2e8f0", color: "#4a5568", border: "none", borderRadius: "4px", cursor: "pointer", lineHeight: "1" }}
                                >
                                    編集
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, theme.pdfId)}
                                    style={{ padding: "3px 6px", fontSize: "11px", backgroundColor: "#fed7d7", color: "#c53030", border: "none", borderRadius: "4px", cursor: "pointer", lineHeight: "1" }}
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                        <div style={{ paddingLeft: "12px", borderLeft: "2px solid #ddd", marginLeft: "4px" }}>
                            {theme.questions && theme.questions.map((q) => {
                                const isSelected = q.questionId === activeQuestionId && activeTab === "edit";
                                return (
                                    <div
                                        key={q.questionId}
                                        onClick={() => onSelectQuestion(theme.pdfId, q.questionId, "edit")}
                                        style={{
                                            padding: "6px 8px", margin: "2px 0", fontSize: "13px", cursor: "pointer", borderRadius: "4px",
                                            backgroundColor: isSelected ? "#e2e8f0" : "transparent",
                                            color: isSelected ? "#000" : "#555",
                                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                        }}
                                    >
                                        • 問: {q.questionText}
                                    </div>
                                );
                            })}
                            <button
                                onClick={() => onAddQuestion(theme.pdfId)}
                                style={{ marginTop: "6px", background: "none", border: "none", color: "#0066cc", cursor: "pointer", fontSize: "12px", padding: 0 }}
                            >
                                + このテーマに問題を追加
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}