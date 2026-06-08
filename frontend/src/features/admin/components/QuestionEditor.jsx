import { useState, useEffect } from "react";

export default function QuestionEditor({ currentQuestion, onSave }) {
    // --- フォーム用のローカルState群 ---
    const [questionText, setQuestionText] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [status, setStatus] = useState("draft");
    const [openAt, setOpenAt] = useState("");
    const [closeAt, setCloseAt] = useState("");

    // 💡 選択されている問題（または新規作成データ）が変わったらフォームに値を詰め直すにゃ！
    useEffect(() => {
        if (currentQuestion) {
            setQuestionText(currentQuestion.questionText || "");
            setCorrectAnswer(currentQuestion.correctAnswer || "");
            setStatus(currentQuestion.status || "draft");

            // Javaから返ってくる日時（YYYY-MM-DDTHH:mm:ss）を datetime-local 形式（YYYY-MM-DDTHH:mm）にトリミングするにゃ
            setOpenAt(currentQuestion.openAt ? currentQuestion.openAt.substring(0, 16) : "");
            setCloseAt(currentQuestion.closeAt ? currentQuestion.closeAt.substring(0, 16) : "");
        } else {
            // 何も選ばれていない時はクリア
            setQuestionText("");
            setCorrectAnswer("");
            setStatus("draft");
            setOpenAt("");
            setCloseAt("");
        }
    }, [currentQuestion]);

    if (!currentQuestion) {
        return (
            <div style={{ color: "#666", textAlign: "center", marginTop: "40px" }}>
                左側のサイドバーから問題を選択するか、「新しい問題を追加」ボタンを押してくださいにゃ🐾
            </div>
        );
    }

    const isNewMode = !!currentQuestion.isNew;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!questionText.trim() || !correctAnswer.trim()) {
            alert("問題文と模範解答は必須項目ですにゃ！");
            return;
        }

        // 組み立てて親コンポーネントの保存関数に丸投げするにゃ🐾
        onSave({
            ...currentQuestion, // 新規作成なら isNew や pdfId が、更新なら questionId が入ってるにゃ
            questionText: questionText.trim(),
            correctAnswer: correctAnswer.trim(),
            status: status,
            openAt: openAt || null,
            closeAt: closeAt || null
        });
    };

    return (
        <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#1e293b", fontSize: "16px" }}>
                {isNewMode ? "✨ 新しい問題のインサート作成" : "📝 問題の編集・更新設定"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* ❓ 問題文入力 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "bold", color: "#475569" }}>問題文 (必須)</label>
                    <textarea
                        rows="4"
                        placeholder="受講者に出題する問題文を入力してにゃ..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", width: "100%", boxSizing: "border-box", resize: "vertical" }}
                        required
                    />
                </div>

                {/* 📝 模範解答入力 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "bold", color: "#475569" }}>模範解答 (必須)</label>
                    <textarea
                        rows="3"
                        placeholder="自動採点や確認に使用する模範解答を入力してにゃ..."
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", width: "100%", boxSizing: "border-box", resize: "vertical" }}
                        required
                    />
                </div>

                {/* 🟢 💡 【新機能】スケジュール設定エリア */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "14px", backgroundColor: "#fff", borderRadius: "6px", border: "1px solid #e2e8f0" }}>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>公開ステータス</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{ padding: "8px", fontSize: "13px", borderRadius: "4px", border: "1px solid #cbd5e1", backgroundColor: "#fff" }}
                        >
                            <option value="draft">未公開 (draft) - 下書き保存</option>
                            <option value="published">公開 (published) - 即時またはスケジュール公開</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>公開開始日時 (open_at)</label>
                        <input
                            type="datetime-local"
                            value={openAt}
                            onChange={(e) => setOpenAt(e.target.value)}
                            style={{ padding: "6px", fontSize: "13px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>公開終了日時 (close_at)</label>
                        <input
                            type="datetime-local"
                            value={closeAt}
                            onChange={(e) => setCloseAt(e.target.value)}
                            style={{ padding: "6px", fontSize: "13px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                        />
                    </div>
                </div>

                {/* 💾 送信ボタン */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                    <button
                        type="submit"
                        style={{
                            padding: "10px 24px",
                            backgroundColor: isNewMode ? "#28a745" : "#0066cc",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "14px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                    >
                        {isNewMode ? "🚀 この内容で新規インサート" : "💾 変更を保存する"}
                    </button>
                </div>

            </form>
        </div>
    );
}