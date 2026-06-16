import { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";

export default function ThemeEditor({ currentTheme, onSave, onCancel, onDelete }) {
    const [title, setTitle] = useState("");
    const [openAt, setOpenAt] = useState("");
    const [closeAt, setCloseAt] = useState("");
    const [status, setStatus] = useState("draft");
    const [fileUrl, setFileUrl] = useState("");

    // モード判定: currentTheme があれば編集、なければ新規作成
    const isNewMode = !!(currentTheme && currentTheme.isNew);

    console.log(currentTheme.status)
    useEffect(() => {
        if (currentTheme && !currentTheme.isNew) {
            setTitle(currentTheme.title || "");
            setFileUrl(currentTheme.fileUrl || "");
            setStatus(currentTheme.status
                ? currentTheme.status.toLowerCase()
                : "draft"
            );
            setOpenAt(currentTheme.openAt ? currentTheme.openAt.substring(0, 16) : "");
            setCloseAt(currentTheme.closeAt ? currentTheme.closeAt.substring(0, 16) : "");
        } else {
            setTitle("");
            setFileUrl("");
            setOpenAt("");
            setCloseAt("");
            setStatus("draft");
        }
    }, [currentTheme]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("タイトルは必須ですにゃ！🐾");
            return;
        }

        try {
            const themeParams = {
                title: title.trim(),
                fileUrl,
                status,
                openAt: openAt ? openAt + ":00" : null,
                closeAt: closeAt ? closeAt + ":00" : null
            };

            let result;
            if (isNewMode) {
                result = await adminApi.createTheme(themeParams);
            } else {
                result = await adminApi.updateTheme(currentTheme.pdfId, themeParams);
            }

            onSave(result);
            alert(isNewMode ? "テーマを新規作成しましたにゃ！🐾" : "テーマを更新しましたにゃ！🐾");
        } catch (error) {
            console.error(error);
            alert("サーバーとの通信に失敗しました。");
        }
    };


    return (
        <div style={{
            background: "#f8fafc",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e2e8f0"
        }}>
            <h3 style={{ marginTop: 0 }}>
                {isNewMode ? "✨ 新規テーマ作成" : "📝 テーマ編集"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                    <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>テーマ名</label>
                    <input
                        type="text"
                        style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>PDF URL</label>
                    <input
                        type="url" // URL形式で入力させる
                        placeholder="https://example.com/file.pdf"
                        style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>公開ステータス</label>
                    <select
                        style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="draft">未公開 (draft)</option>
                        <option value="published">公開 (published/scheduled)</option>
                    </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>開始日時</label>
                        <input
                            type="datetime-local"
                            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
                            value={openAt}
                            onChange={(e) => setOpenAt(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>終了日時</label>
                        <input
                            type="datetime-local"
                            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}
                            value={closeAt}
                            onChange={(e) => setCloseAt(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                    {/* 既存の編集モードの時だけ削除ボタンを表示 */}
                    {!isNewMode && onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(currentTheme.pdfId)}
                            style={{ padding: "10px 20px", borderRadius: 6, border: "1px solid #ef4444", color: "#ef4444", backgroundColor: "#fff", cursor: "pointer" }}
                        >
                            テーマを削除
                        </button>
                    )}
                    {isNewMode && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{ padding: "10px 20px", borderRadius: 6, border: "1px solid #cbd5e1", cursor: "pointer" }}
                        >
                            キャンセル
                        </button>
                    )}
                    <button type="submit" style={{ padding: "10px 20px", borderRadius: 6, border: "none", backgroundColor: "#0066cc", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
                        {isNewMode ? "作成する" : "保存する"}
                    </button>
                </div>
            </form>
        </div>
    );
}