import { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import ProgressCard from "./ProgressCard";

export default function ProgressChecker({ currentTheme }) {
    const [progressList, setProgressList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openUsersId, setOpenUsersId] = useState({});

    useEffect(() => {
        const fetchProgress = async () => {
            if (!currentTheme || !currentTheme.questions) return;

            setIsLoading(true);

            try {
                const data = await adminApi.getProgress();

                const themeQuestions = currentTheme.questions || [];

                const themeQuestionIds = themeQuestions.map(q => String(q.questionId));

                const filtered = data.filter(item =>
                    themeQuestionIds.includes(String(item.questionId))
                );

                const ordered = themeQuestions.map(q => {
                    const matched = filtered.find(
                        item => String(item.questionId) === String(q.questionId)
                    );

                    return {
                        questionId: q.questionId,
                        questionText: q.questionText,
                        answeredUserCount: matched?.answeredUserCount || 0,
                        totalUserCount: matched?.totalUserCount || 0,
                        uncompletedUsers: matched?.uncompletedUsers || []
                    };
                });

                setProgressList(ordered);

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, [currentTheme]);// 💡 currentThemeが変わるたびに実行される

    // ...以下（toggleUncompleted や レンダリング部分はそのまま）

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