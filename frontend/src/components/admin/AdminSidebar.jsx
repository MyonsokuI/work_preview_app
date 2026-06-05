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
    onLogout,
    onDeleteQuestion
}) {
    const [newThemeName, setNewThemeName] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // 🚀 💡 検索キーワードを保持するStateにゃ！

    // 🟢 テーマ追加の処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newThemeName.trim()) return;

        try {
            const response = await fetch("http://localhost:8080/api/themes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newThemeName.trim() }),
            });

            if (!response.ok) throw new Error("テーマの作成に失敗しました");

            const savedPdf = await response.json();
            onAddTheme({ pdfId: savedPdf.pdfId, title: savedPdf.title, questions: [] });
            setNewThemeName("");
        } catch (error) {
            console.error("テーマ作成APIの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    // 🔴 テーマ削除の処理
    const handleDelete = async (e, themeId) => {
        e.stopPropagation();
        if (!window.confirm("このテーマを削除してもよろしいですか？\n※紐づく問題もすべて削除されます。")) return;

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newName.trim() }),
            });
            if (!response.ok) throw new Error("テーマ名の更新に失敗しました");

            const updatedPdf = await response.json();
            onUpdateTheme(themeId, updatedPdf.title);
        } catch (error) {
            console.error("テーマ更新APIとの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    // 🔴 問題削除の処理
    const handleQuestionDelete = async (e, questionId, themeId) => {
        e.stopPropagation();
        if (!window.confirm("この問題を削除してもよろしいですか？\n※受講者の回答データもすべて削除されます。")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/questions/${questionId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                onDeleteQuestion(themeId, questionId);
            } else {
                alert("問題の削除に失敗しました。");
            }
        } catch (error) {
            console.error("問題削除APIとの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    // ==========================================\n    // 🚀 💡 【検索の魔法】入力文字でテーマ・問題をフィルタリングするロジックにゃ！\n    // ==========================================
    const filteredThemes = themes.map((theme) => {
        // キーワードが空ならそのまま全件表示にゃ
        if (!searchQuery.trim()) return theme;

        const query = searchQuery.toLowerCase();

        // 1. テーマ名がヒットするかチェック
        const isThemeMatch = theme.title.toLowerCase().includes(query);

        // 2. 問題文の中にヒットするものがあるか絞り込む
        const matchedQuestions = (theme.questions || []).filter((q) =>
            q.questionText.toLowerCase().includes(query)
        );

        // テーマ名がマッチした、もしくは問題が1件でもマッチした場合は、そのテーマを表示対象にするにゃ
        if (isThemeMatch || matchedQuestions.length > 0) {
            return {
                ...theme,
                // テーマ名自体がマッチした場合は全問題を見せ、問題文だけがマッチした場合はその問題だけを表示に絞る親切設計にゃ！
                questions: isThemeMatch ? theme.questions : matchedQuestions,
                isMatch: true // 画面表示の判定用フラグにゃ
            };
        }

        // どちらもマッチしなかったら null を返すにゃ
        return null;
    }).filter(Boolean); // null を配列から綺麗に排除するにゃ！

    return (
        <div style={{ width: "300px", borderRight: "1px solid #ccc", padding: "16px", backgroundColor: "#f8f9fa", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* 🚪 ログアウトボタン配置エリア */}
            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", display: "flex", justifycontent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: "#555" }}>管理者フォーム</h3>
                <button
                    onClick={onLogout}
                    style={{ padding: "6px 12px", backgroundColor: "#e2e8f0", color: "#4a5568", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
                >
                    ログアウト
                </button>
            </div>

            {/* 🚀 💡 【新機能】検索用テキストボックス配置エリアにゃ！ */}
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="🔍 テーマ・問題文から検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%", padding: "8px 12px", fontSize: "13px", borderRadius: "6px",
                        border: "1px solid #cbd5e1", boxSizing: "border-box", backgroundColor: "#fff"
                    }}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        style={{
                            position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px"
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* 新テーマ追加フォーム */}
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

            {/* テーマ・問題リスト表示エリア（💡 filteredThemes を回すように変更したにゃ！） */}
            <div style={{ flex: 1 }}>
                {filteredThemes.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", marginTop: "20px" }}>
                        検索結果が見つかりませんにゃ 🐾
                    </div>
                ) : (
                    filteredThemes.map((theme) => (
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
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: "4px"
                                            }}
                                        >
                                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                                                • 問: {q.questionText}
                                            </span>

                                            <button
                                                onClick={(e) => handleQuestionDelete(e, q.questionId, theme.pdfId)}
                                                style={{
                                                    padding: "2px 6px", fontSize: "10px", backgroundColor: "#fed7d7", color: "#c53030",
                                                    border: "none", borderRadius: "4px", cursor: "pointer", lineHeight: "1", flexShrink: 0,
                                                    display: isSelected ? "block" : "none"
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = "#feb2b2"}
                                                onMouseOut={(e) => e.target.style.backgroundColor = "#fed7d7"}
                                            >
                                                消去
                                            </button>
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
                    ))
                )}
            </div>
        </div>
    );
}