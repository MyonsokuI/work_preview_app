import { useState, useEffect } from "react";

export default function QuestionEditor({ currentQuestion, onSave }) {
    const [editContent, setEditContent] = useState("");
    const [editModelAnswer, setEditModelAnswer] = useState("");

    // 選択された問題が変わったら、フォーム内のテキストを同期する
    useEffect(() => {
        if (currentQuestion) {
            setEditContent(currentQuestion.questionText);
            setEditModelAnswer(currentQuestion.correctAnswer);
        }
    }, [currentQuestion]);

    if (!currentQuestion) {
        return <div style={{ color: "#666" }}>左側メニューから問題を選択してください。</div>;
    }

    return (
        <div style={{ maxWidth: "800px" }}>
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>問題文の編集 (ID: {currentQuestion.questionId})</h4>
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ width: "100%", height: "80px", padding: "8px", boxSizing: "border-box" }}
                />
            </div>
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>模範解答の登録・更新</h4>
                <textarea
                    value={editModelAnswer}
                    onChange={(e) => setEditModelAnswer(e.target.value)}
                    style={{ width: "100%", height: "80px", padding: "8px", boxSizing: "border-box" }}
                />
            </div>
            <button
                onClick={() => onSave(editContent, editModelAnswer)}
                style={{ padding: "10px 20px", backgroundColor: "#0066cc", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
                変更を保存する
            </button>
        </div>
    );
}