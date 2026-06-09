import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

export default function AdminReview() {
    const [themes, setThemes] = useState([]);

    const [selectedTheme, setSelectedTheme] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState("");

    const reviewerId = 1; // 仮

    // -----------------------
    // テーマ取得
    // -----------------------
    useEffect(() => {
        loadThemes();
    }, []);

    const loadThemes = async () => {
        try {
            const data = await adminApi.getThemes();
            setThemes(data);
        } catch (err) {
            console.error(err);
        }
    };

    // -----------------------
    // 回答一覧取得
    // -----------------------
    const loadAnswers = async (questionId) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/questions/${questionId}/answers`
            );

            const data = await res.json();

            setAnswers(data);
        } catch (err) {
            console.error(err);
        }
    };

    // -----------------------
    // レビュー取得
    // -----------------------
    const loadReviews = async (answerId) => {
        try {
            const data = await adminApi.getReviewsByAnswer(answerId);
            setReviews(data);
        } catch (err) {
            console.error(err);
        }
    };

    // -----------------------
    // 問題選択
    // -----------------------
    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);

        setSelectedAnswer(null);
        setReviews([]);

        loadAnswers(question.questionId);
    };

    // -----------------------
    // 回答選択
    // -----------------------
    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);

        loadReviews(answer.answerId);
    };

    // -----------------------
    // レビュー登録
    // -----------------------
    const handleCreateReview = async () => {
        if (!selectedAnswer) return;

        if (!comment.trim()) return;

        try {
            await adminApi.createReview(
                reviewerId,
                selectedAnswer.answerId,
                comment
            );

            setComment("");

            loadReviews(selectedAnswer.answerId);
        } catch (err) {
            console.error(err);
        }
    };

    // -----------------------
    // レビュー削除
    // -----------------------
    const handleDeleteReview = async (reviewId) => {
        try {
            await adminApi.deleteReview(reviewId);

            loadReviews(selectedAnswer.answerId);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* ========================= */}
            {/* 左側 */}
            {/* ========================= */}
            <div
                style={{
                    width: "30%",
                    borderRight: "1px solid #ddd",
                    padding: "10px",
                    overflowY: "auto",
                }}
            >
                <h2>課題一覧</h2>

                {themes.map((theme) => (
                    <div key={theme.pdfId}>
                        <div
                            style={{
                                fontWeight: "bold",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                            onClick={() =>
                                setSelectedTheme(
                                    selectedTheme === theme.pdfId ? null : theme.pdfId
                                )
                            }
                        >
                            📁 {theme.title}
                        </div>

                        {selectedTheme === theme.pdfId &&
                            theme.questions?.map((question) => (
                                <div
                                    key={question.questionId}
                                    style={{
                                        marginLeft: "20px",
                                        cursor: "pointer",
                                        padding: "5px",
                                    }}
                                    onClick={() => handleQuestionClick(question)}
                                >
                                    📝 {question.questionText}
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            {/* ========================= */}
            {/* 中央 */}
            {/* ========================= */}
            <div
                style={{
                    width: "35%",
                    borderRight: "1px solid #ddd",
                    padding: "10px",
                    overflowY: "auto",
                }}
            >
                <h2>回答一覧</h2>

                {answers.map((answer) => (
                    <div
                        key={answer.answerId}
                        onClick={() => handleAnswerClick(answer)}
                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            marginBottom: "10px",
                            cursor: "pointer",
                        }}
                    >
                        <div>
                            <strong>{answer.userName}</strong>
                        </div>

                        <div>{answer.answerContent}</div>
                    </div>
                ))}
            </div>

            {/* ========================= */}
            {/* 右側 */}
            {/* ========================= */}
            <div
                style={{
                    width: "35%",
                    padding: "10px",
                    overflowY: "auto",
                }}
            >
                <h2>レビュー</h2>

                {selectedAnswer && (
                    <>
                        <div
                            style={{
                                border: "1px solid #ddd",
                                padding: "10px",
                                marginBottom: "15px",
                            }}
                        >
                            <div>
                                <strong>{selectedAnswer.userName}</strong>
                            </div>

                            <div>{selectedAnswer.answerContent}</div>
                        </div>

                        <h3>レビュー履歴</h3>

                        {reviews.map((review) => (
                            <div
                                key={review.reviewId}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    marginBottom: "8px",
                                }}
                            >
                                <div>{review.comment}</div>

                                <button
                                    onClick={() =>
                                        handleDeleteReview(review.reviewId)
                                    }
                                >
                                    削除
                                </button>
                            </div>
                        ))}

                        <h3>レビュー登録</h3>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            style={{
                                width: "100%",
                            }}
                        />

                        <button
                            onClick={handleCreateReview}
                            style={{
                                marginTop: "10px",
                            }}
                        >
                            レビュー登録
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}