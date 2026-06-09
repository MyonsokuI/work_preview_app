import { useEffect, useState } from "react";

export default function GeneralReview({ answerId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!answerId) return;

        fetch(
            `http://localhost:8080/api/answers/${answerId}/reviews`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("レビュー取得失敗");
                }

                return res.json();
            })
            .then((data) => {
                setReviews(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [answerId]);

    return (
        <div>
            <h3>レビュー</h3>

            {reviews.length === 0 ? (
                <p>レビューはまだありません。</p>
            ) : (
                reviews.map((review) => (
                    <div
                        key={review.reviewId}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "12px",
                            marginBottom: "10px",
                        }}
                    >
                        {/* レビューコメント */}
                        <div style={{ marginBottom: "8px" }}>{review.comment}</div>

                        {/* 投稿者名と日時の表示 */}
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end", // これで中身をすべて右寄せにします
                            gap: "10px",
                            color: "#aa", // 必要に応じて文字色を調整してください（少し薄くしています）
                            fontSize: "12px"
                        }}>
                            {review.reviewerName && (
                                <small style={{ fontWeight: "bold" }}>
                                    {review.reviewerName} さん
                                </small>
                            )}

                            {review.createdAt && (
                                <small>
                                    {new Date(review.createdAt).toLocaleString()}
                                </small>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}