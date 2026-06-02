import { useState } from "react";

export default function AdminSidebar({ themes, activeQuestionId, activeTab, onSelectQuestion, onAddQuestion, onAddTheme, onDeleteTheme, onUpdateTheme, onShowProgress }) {
    const [newThemeName, setNewThemeName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newThemeName.trim()) return;
        onAddTheme(newThemeName);
        setNewThemeName("");
    };

    // 🔥 削除の処理（これをついになるように追加します）
    const handleDelete = (e, themeId) => {

        e.stopPropagation();
        // 誤操作防止の確認ダイアログだけ挟んで、親の関数を呼ぶ
        if (window.confirm("このテーマを削除してもよろしいですか？")) {
            onDeleteTheme(themeId);
        }
    };

    // 📝 編集の処理
    const handleEdit = (e, themeId, currentName) => {
        // 親要素（行全体）へのクリックイベント伝播を絶対に止める
        e.stopPropagation();

        // 簡易的にブラウザの入力ダイアログ（prompt）で新しい名前を受け取る
        const newName = window.prompt("新しいテーマ名を入力してください：", currentName);

        // キャンセルされたり、空文字の場合は処理を中断
        if (newName === null || !newName.trim()) return;

        // 親のState操作関数を呼び出す（対になる処理）
        onUpdateTheme(themeId, newName.trim());
    };

    // // 🌟 テーマ削除のAPI通信処理
    // const handleDelete = async (e,themeId) => {
    //     // 誤操作防止の確認アラート
    //     if (!window.confirm(`テーマ「${themeName}」を削除してもよろしいですか？\n※紐づく問題もすべて削除されます。`)) {
    //         return;
    //     }

    //     try {
    //         // API設計書に沿って DELETE /api/themes/{themeid} を叩く
    //         const response = await fetch(`http://localhost:8080/api/themes/${themeId}`, {
    //             method: "DELETE",
    //         });

    //         const result = await response.json();

    //         if (result.status === "success") {
    //             alert(result.message); // 「テーマを削除しました」など
    //             onDeleteTheme(themeId); // 💡 親のStateから削除したテーマを消し去る
    //         } else {
    //             alert("削除に失敗しました: " + result.message);
    //         }
    //     } catch (error) {
    //         console.error("テーマ削除APIとの通信に失敗しました:", error);
    //     }
    // };

    //テーマ追加のAPI通信処理
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!newThemeName.trim()) return;

    //     try {
    //         // 💡 バックエンドのテーマ作成APIを叩く
    //         const response = await fetch("http://localhost:8080/api/themes", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ title: newThemeName }), 
    //         });

    //         const result = await response.json();

    //         if (result.status === "success") {
    //             // バックエンドから返ってきた「本物のIDが入ったテーマオブジェクト」を親(AdminConsole)に渡す
    //             onAddTheme(result.data.name);
    //             // ※現状の親の handleAddTheme(themeName) は名前だけ受け取る仕様なので、
    //             // 完全に連動させる場合は親側で ID も受け取れるように少し調整するとより完璧です！

    //             setNewThemeName("");
    //             alert(result.message); // 「テーマを新規作成しました。」と表示される
    //         }
    //     } catch (error) {
    //         console.error("テーマ作成APIの通信に失敗しました:", error);
    //     }
    // };
    // 📝 編集の処理（API通信版）
    // const handleEdit = async (e, themeId, currentName) => {
    //     // 親要素（行全体）へのクリックイベント伝播を絶対に止める
    //     e.stopPropagation();

    //     // 1. ユーザーに新しい名前を入力してもらう
    //     const newName = window.prompt("新しいテーマ名を入力してください：", currentName);

    //     // キャンセルされたり、空文字の場合は処理を中断
    //     if (newName === null || !newName.trim()) return;

    //     try {
    //         // 2. API設計書（PUT /api/themes/{themeid}）に沿ってバックエンド通信を実行
    //         const response = await fetch(`http://localhost:8080/api/themes/${themeId}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             // API設計書のキー名「title」または「name」に合わせて送信します
    //             // バックエンドのEntityのフィールド名に合わせて調整してください
    //             body: JSON.stringify({
    //                 title: newName.trim()
    //             }),
    //         });

    //         // 3. レスポンスの解析
    //         const result = await response.json();

    //         // 4. バックエンド側で更新が成功した場合のみ、フロントの画面（State）を書き換える
    //         if (result.status === "success") {
    //             // 親のState操作関数を呼び出す（バックエンドから返ってきた確定データ、または入力値を使う）
    //             onUpdateTheme(themeId, newName.trim());

    //             // オプション：成功メッセージ（不要なら消してもOKです）
    //             // alert(result.message || "テーマ名を更新しました");
    //         } else {
    //             alert("更新に失敗しました: " + result.message);
    //         }
    //     } catch (error) {
    //         console.error("テーマ更新APIとの通信に失敗しました:", error);
    //         alert("サーバーとの通信に失敗しました。");
    //     }
    // };
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
                        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                            {/* 📝 編集ボタン */}
                            <button
                                onClick={(e) => handleEdit(e, theme.pdfId, theme.name)}
                                style={{
                                    padding: "3px 6px",
                                    fontSize: "11px",
                                    backgroundColor: "#e2e8f0", // 原色の黄色から落ち着いたグレーに変更
                                    color: "#4a5568",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    lineHeight: "1" // 💡 ブラウザが勝手に作る変な余白をリセットして縦ズレを徹底防止
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
                                    backgroundColor: "#fed7d7", // キツい赤から目に優しい薄赤に変更
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