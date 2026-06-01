import { useEffect, useState } from "react";

export default function QuestionList({ themeId, onBack }) {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        // バックエンドの新しいAPIを叩く
        fetch(`http://localhost:8080/api/themes/${themeId}/questions`)
            .then((res) => res.json())
            .then((data) => setQuestions(data))
            .catch((err) => console.error(err));
    }, [themeId]);

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={onBack} style={{ marginBottom: "20px", padding: "5px 10px" }}>
                ← テーマ一覧に戻る
            </button>

            <h1>問題一覧 (テーマID: {themeId})</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {questions.map((q) => (
                    <div
                        key={q.questionId}
                        style={{
                            padding: "15px",
                            border: "1px solid #aaa",
                            borderRadius: "6px",
                            backgroundColor: "#f9f9f9"
                        }}
                    >
                        <p style={{ margin: 0, fontWeight: "bold" }}>問 {q.questionId}</p>
                        <p style={{ margin: "5px 0 0 0" }}>{q.content}</p>
                    </div>
                ))}
                {questions.length === 0 && <p>問題が登録されていません。</p>}
            </div>
        </div>
    );
}