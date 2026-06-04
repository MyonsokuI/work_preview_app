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
    onShowProgress
}) {
    const [newThemeName, setNewThemeName] = useState("");

    // 🟢 テーマ追加の処理（API通信連携版）
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newThemeName.trim()) return;

        try {
            // 1. バックエンド（PdfController の @PostMapping）にリクエストを送信
            const response = await fetch("http://localhost:8080/api/themes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newThemeName.trim() }),
            });

            if (!response.ok) throw new Error("テーマの作成に失敗しました");

            // 2. サーバー側から返ってきた「自動採番された pdfId 入り」のオブジェクトを受け取る
            const savedPdf = await response.json();

            // 3. 親（AdminConsole）のStateに、DBから発行された本物のオブジェクトを流し込む
            // ※ 親の handleAddTheme を (themeObject) => { setThemes([...themes, themeObject]) } のように受ける形にしておくと完璧です！
            // もし親がまだ文字列しか受け取れない実装であれば、内部で { pdfId: savedPdf.pdfId, title: savedPdf.title, questions: [] } を生成して追加してください。
            onAddTheme({
                pdfId: savedPdf.pdfId,
                title: savedPdf.title,
                questions: [] // 新規作成時は問題は空配列
            });

            setNewThemeName("");
        } catch (error) {
            console.error("テーマ作成APIの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    // 🔴 テーマ削除の処理（API通信連携版）
    const handleDelete = async (e, themeId) => {
        e.stopPropagation();

        if (!window.confirm("このテーマを削除してもよろしいですか？\n※紐づく問題もすべて削除されます。")) {
            return;
        }

        try {
            // バックエンド（PdfController の @DeleteMapping("/{id}")) にリクエストを送信
            const response = await fetch(`http://localhost:8080/api/themes/${themeId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // 成功したら親のStateから削除して画面をリアルタイム更新
                onDeleteTheme(themeId);
            } else {
                alert("削除に失敗しました。");
            }
        } catch (error) {
            console.error("テーマ削除APIとの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    // 🟡 テーマ編集の処理（API通信連携版）
    const handleEdit = async (e, themeId, currentTitle) => {
        e.stopPropagation();

        // ブラウザの入力ダイアログ（prompt）で新しい名前を受け取る
        const newName = window.prompt("新しいテーマ名を入力してください：", currentTitle);

        if (newName === null || !newName.trim()) return;

        try {
            // バックエンド（PdfController の @PutMapping("/{id}")) にリクエストを送信
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

            const updatedPdf = await response.json(); // 更新後のオブジェクトを取得

            // 親のState操作関数を呼び出して同期
            onUpdateTheme(themeId, updatedPdf.title);
        } catch (error) {
            console.error("テーマ更新APIとの通信に失敗しました:", error);
            alert("サーバーとの通信に失敗しました。");
        }
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
                        {/* コントローラーの返却値「title」としっかりマッピング */}
                        <span>▼ {theme.title}</span>
                        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                            {/* 📝 編集ボタン */}
                            <button
                                onClick={(e) => handleEdit(e, theme.pdfId, theme.title)}
                                style={{
                                    padding: "3px 6px",
                                    fontSize: "11px",
                                    backgroundColor: "#e2e8f0",
                                    color: "#4a5568",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    lineHeight: "1"
                                }}
                            >
                                編集
                            </button>

                            {/* 🗑️ 削除ボタン */}
                            <button
                                onClick={(e) => handleDelete(e, theme.pdfId)}
                                style={{
                                    padding: "3px 6px",
                                    fontSize: "11px",
                                    backgroundColor: "#fed7d7",
                                    color: "#c53030",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    lineHeight: "1"
                                }}
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
                                    {/* コントローラーの返却値「questionText」としっかりマッピング */}
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
    );
}