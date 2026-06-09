import ProgressBar from "./ProgressBar";
import UncompletedUsers from "./UncompletedUsers";

export default function ProgressCard({ item, isOpen, onToggle }) {
    const answered = item.answeredUserCount || 0;
    const total = item.totalUserCount || 0;
    const rate = total > 0 ? Math.round((answered / total) * 100) : 0;
    const uncompleted = item.uncompletedUsers || [];

    return (
        <div style={{
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            background: "#fff"
        }}>
            {/* 上部 */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8
            }}>
                <div style={{ fontWeight: "bold", fontSize: 14 }}>
                    ID: {item.questionId} | {item.questionText}
                </div>

                <div style={{ fontWeight: "bold" }}>
                    {answered} / {total}
                </div>
            </div>

            {/* バー */}
            <ProgressBar rate={rate} />

            {/* 未完了 */}
            <UncompletedUsers
                uncompleted={uncompleted}
                isOpen={isOpen}
                onToggle={onToggle}
            />
        </div>
    );
}