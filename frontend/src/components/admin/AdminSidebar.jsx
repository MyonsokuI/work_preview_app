import { useState } from "react";

export default function AdminSidebar({ themes, activeQuestionId, activeTab, onSelectQuestion, onAddQuestion, onAddTheme, onShowProgress }) {
    const [newThemeName, setNewThemeName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newThemeName.trim()) return;
        onAddTheme(newThemeName);
        setNewThemeName("");
    };

    return (
        <div style={{ width: "300px", borderRight: "1px solid #ccc", padding: "16px", backgroundColor: "#f8f9fa", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", margin: 0, color: "#555" }}>⚙️ 管理者コンソール</h3>
                <button onClick={onShowProgress} style={{ padding: "4px 8px", fontSize: "11px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    📊 全体進捗
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", gap: "4px" }}>
                <input
                    type="text"
                    placeholder="新テーマ名"
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    style={{ flex: 1, padding: "6px", fontSize: "12px" }}
                />
                <button type="submit" style={{ padding: "6px 10px", fontSize: "12px", cursor: "pointer" }}>追加</button>
            </form>

            {themes.map((theme) => (
                <div key={theme.pdfId} style={{ marginBottom: "16px" }}>
                    <div
                        style={{ fontWeight: "bold", fontSize: "14px", padding: "4px 0", color: "#111", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                        onClick={() => onSelectQuestion(theme.pdfId, null, "progress")}
                    >
                        <span>▼ {theme.name}</span>
                    </div>
                    <div style={{ paddingLeft: "12px", borderLeft: "2px solid #ddd", marginLeft: "4px" }}>
                        {theme.questions.map((q) => {
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
                                    • 問: {q.content}
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
    );
}