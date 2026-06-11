import { useState, useEffect } from "react";
import QuestionTextField from "./QuestionTextField";
import AnswerField from "./AnswerField";
import ScheduleFields from "./ScheduleFields";
import SubmitButton from "./SubmitButton";

export default function QuestionEditor({ currentQuestion, onSave, onDelete, onCancel }) {
    const [questionText, setQuestionText] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [status, setStatus] = useState("draft");
    const [openAt, setOpenAt] = useState("");
    const [closeAt, setCloseAt] = useState("");

    useEffect(() => {
        if (currentQuestion) {
            setQuestionText(currentQuestion.questionText || "");
            setCorrectAnswer(currentQuestion.correctAnswer || "");
            setStatus(currentQuestion.status || "draft");
            setOpenAt(currentQuestion.openAt?.substring(0, 16) || "");
            setCloseAt(currentQuestion.closeAt?.substring(0, 16) || "");
        } else {
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
                左側から問題を選択してにゃ🐾
            </div>
        );
    }

    const handleDelete = () => {
        if (!currentQuestion.questionId) return; // 新規作成中の場合は何もしない
        onDelete(currentQuestion.pdfId, currentQuestion.questionId);
    };
    const isNewMode = !!currentQuestion.isNew;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!questionText.trim() || !correctAnswer.trim()) {
            alert("必須項目です");
            return;
        }

        onSave({
            ...currentQuestion,
            questionText: questionText.trim(),
            correctAnswer: correctAnswer.trim(),
            status,
            openAt: openAt || null,
            closeAt: closeAt || null
        });
    };

    return (
        <div style={{ background: "#f8fafc", padding: 20, borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <h3>
                {isNewMode ? "✨ 新規問題" : "📝 問題編集"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                <QuestionTextField value={questionText} onChange={setQuestionText} />

                <AnswerField value={correctAnswer} onChange={setCorrectAnswer} />

                {/* <ScheduleFields
                    status={status}
                    setStatus={setStatus}
                    openAt={openAt}
                    setOpenAt={setOpenAt}
                    closeAt={closeAt}
                    setCloseAt={setCloseAt}
                /> */}

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end", // 💡 これを space-between から変更
                    gap: "10px",                // 💡 ボタンの間に隙間を作る
                    marginTop: "20px"
                }}>
                    {isNewMode && (
                        <button
                            type="button"
                            onClick={() => {
                                // 新規作成をキャンセルして、フォームを閉じるために setCreatingQuestion(null) を呼ぶ想定です
                                // 現在の onSave を使わずに親で処理しても良いですが、簡単には here を調整します
                                // 親から onCancel を渡すのがベストです！
                                onCancel();
                            }}
                            style={{ padding: "10px 20px", borderRadius: 6, border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer" }}
                        >
                            キャンセル
                        </button>
                    )}
                    {/* 削除ボタン */}
                    {!isNewMode && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 6,
                                border: "1px solid #ef4444",
                                color: "#ef4444",
                                backgroundColor: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            削除する
                        </button>
                    )}

                    {/* 保存ボタン */}
                    <SubmitButton isNewMode={isNewMode} />
                </div>
            </form>
        </div>
    );
}