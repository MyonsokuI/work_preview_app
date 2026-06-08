import { useState, useEffect } from "react";
import QuestionTextField from "./QuestionTextField";
import AnswerField from "./AnswerField";
import ScheduleFields from "./ScheduleFields";
import SubmitButton from "./SubmitButton";

export default function QuestionEditor({ currentQuestion, onSave }) {
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

                <ScheduleFields
                    status={status}
                    setStatus={setStatus}
                    openAt={openAt}
                    setOpenAt={setOpenAt}
                    closeAt={closeAt}
                    setCloseAt={setCloseAt}
                />

                <SubmitButton isNewMode={isNewMode} />
            </form>
        </div>
    );
}