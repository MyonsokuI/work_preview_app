import { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import ProgressCard from "./ProgressCard";

export default function ProgressChecker({ currentTheme }) {
    const [progressList, setProgressList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openUsersId, setOpenUsersId] = useState({});

    useEffect(() => {
        adminApi.getProgress()
            .then((data) => {
                if (currentTheme?.questions?.length > 0) {
                    const combined = currentTheme.questions.map((q) => {
                        const matched = data.find(
                            (item) => String(item.questionId) === String(q.questionId)
                        );

                        return {
                            questionId: q.questionId,
                            questionText: q.questionText,
                            answeredUserCount: matched ? matched.answeredUserCount : 0,
                            totalUserCount: matched ? matched.totalUserCount : (data[0]?.totalUserCount || 8),
                            uncompletedUsers: matched ? matched.uncompletedUsers : []
                        };
                    });

                    setProgressList(combined);
                } else {
                    setProgressList(data);
                }

                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, [currentTheme]);

    const toggleUncompleted = (id) => {
        setOpenUsersId((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (isLoading) {
        return <div style={{ padding: 24 }}>進捗取得中...</div>;
    }

    if (progressList.length === 0) {
        return <div style={{ padding: 24 }}>データなし</div>;
    }

    return (
        <div style={{ maxWidth: "800px" }}>
            <h3>
                📊 【問題別進捗】{currentTheme?.title || "全体"}
            </h3>

            {progressList.map((item) => (
                <ProgressCard
                    key={item.questionId}
                    item={item}
                    isOpen={!!openUsersId[item.questionId]}
                    onToggle={() => toggleUncompleted(item.questionId)}
                />
            ))}
        </div>
    );
}