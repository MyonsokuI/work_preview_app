import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

export default function ReviewPanel({ questionId }) {

    const [answers, setAnswers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const reviewerId = 1;

    // ----------------------
    // 回答取得（API統一版）
    // ----------------------
    const loadAnswers = async (qid) => {
        if (!qid) return;

        setLoading(true);
        try {
            const data = await adminApi.getAnswersByQuestion(qid);
            setAnswers(data);
        } catch (err) {
            console.error("回答取得エラー:", err);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------
    // レビュー取得
    // ----------------------
    const loadReviews = async (answerId) => {
        try {
            const data = await adminApi.getReviewsByAnswer(answerId);
            setReviews(data);
        } catch (err) {
            console.error("レビュー取得エラー:", err);
        }
    };

    // ----------------------
    // questionId変更時
    // ----------------------
    useEffect(() => {
        if (!questionId) return;

        setSelectedAnswer(null);
        setReviews([]);
        setAnswers([]);

        loadAnswers(questionId);
    }, [questionId]);

    // ----------------------
    // レビュー投稿
    // ----------------------
    const handleCreate = async () => {
        if (!selectedAnswer || !comment.trim()) return;

        try {
            await adminApi.createReview(
                reviewerId,
                selectedAnswer.answerId,
                comment
            );

            setComment("");
            loadReviews(selectedAnswer.answerId);
        } catch (err) {
            console.error("レビュー投稿エラー:", err);
        }
    };

    // ----------------------
    // ガード
    // ----------------------
    if (!questionId) {
        return (
            <div style={{ padding: 20, color: "#999" }}>
                問題を選択してください
            </div>
        );
    }

    return (
        <div style={{ display: "flex", gap: "16px" }}>

            {/* ===================== */}
            {/* 回答一覧 */}
            {/* ===================== */}
            <div style={{ width: "50%", overflowY: "auto" }}>
                <h3>回答一覧</h3>

                {loading && <div>読み込み中...</div>}

                {answers.map((a) => (
                    <div
                        key={a.answerId}
                        onClick={() => {
                            setSelectedAnswer(a);
                            loadReviews(a.answerId);
                        }}
                        style={{
                            border: selectedAnswer?.answerId === a.answerId
                                ? "2px solid #007bff"
                                : "1px solid #ddd",
                            padding: "10px",
                            marginBottom: "8px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            background: "#fff"
                        }}
                    >
                        <strong>{a.userName}</strong>
                        <div>{a.answerContent}</div>
                    </div>
                ))}
            </div>

            {/* ===================== */}
            {/* レビュー */}
            {/* ===================== */}
            <div style={{ width: "50%", overflowY: "auto" }}>
                <h3>レビュー</h3>

                {!selectedAnswer ? (
                    <div style={{ color: "#999" }}>
                        回答を選択してください
                    </div>
                ) : (
                    <>
                        <div
                            style={{
                                border: "1px solid #ddd",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "6px"
                            }}
                        >
                            {selectedAnswer.answerContent}
                        </div>

                        <h4>レビュー履歴</h4>

                        {reviews.map((r) => (
                            <div
                                key={r.reviewId}
                                style={{
                                    border: "1px solid #eee",
                                    padding: "8px",
                                    marginBottom: "6px",
                                    borderRadius: "4px"
                                }}
                            >
                                {r.comment}
                            </div>
                        ))}

                        <h4>レビュー投稿</h4>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            style={{
                                width: "100%",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />

                        <button
                            onClick={handleCreate}
                            style={{
                                marginTop: "10px",
                                padding: "8px 12px",
                                background: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                        >
                            レビュー投稿
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}