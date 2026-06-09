import { useState } from "react";
import { adminApi } from "../../api/adminApi";

export default function ThemeCreateSection({ onAddTheme }) {
    const [newThemeTitle, setNewThemeTitle] = useState("");
    const [openAt, setOpenAt] = useState("");
    const [closeAt, setCloseAt] = useState("");
    const [status, setStatus] = useState("draft");
    const [showAddForm, setShowAddForm] = useState(false);

    const handleSubmitTheme = async (e) => {
        e.preventDefault();
        if (!newThemeTitle.trim()) return;

        try {
            const themeParams = {
                title: newThemeTitle.trim(),
                status,
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
            console.error(error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

    return (
        <div style={{
            border: "1px solid #e2e8f0",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#fff"
        }}>
            {!showAddForm ? (
                <button
                    onClick={() => setShowAddForm(true)}
                    style={{
                        width: "100%",
                        padding: "8px",
                        backgroundColor: "#0066cc",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "12px"
                    }}
                >
                    ➕ 新しいテーマを作成する
                </button>
            ) : (
                <form onSubmit={handleSubmitTheme} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}>
                    <div style={{ fontWeight: "bold", fontSize: "12px" }}>
                        新規テーマ登録
                    </div>

                    <input
                        type="text"
                        placeholder="テーマ名（必須）"
                        value={newThemeTitle}
                        onChange={(e) => setNewThemeTitle(e.target.value)}
                        required
                    />

                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="draft">未公開 (draft)</option>
                        <option value="published">公開 (published/scheduled)</option>
                    </select>

                    <input
                        type="datetime-local"
                        value={openAt}
                        onChange={(e) => setOpenAt(e.target.value)}
                    />

                    <input
                        type="datetime-local"
                        value={closeAt}
                        onChange={(e) => setCloseAt(e.target.value)}
                    />

                    <div style={{ display: "flex", gap: "4px" }}>
                        <button type="submit">
                            テーマを新規作成
                        </button>

                        <button type="button" onClick={() => setShowAddForm(false)}>
                            キャンセル
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}