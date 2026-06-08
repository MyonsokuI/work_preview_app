import { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import ProgressCard from "./ProgressCard";

export default function ProgressChecker({ currentTheme }) {
    const [progressList, setProgressList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openUsersId, setOpenUsersId] = useState({});

    useEffect(() => {
        const fetchProgress = async () => {
            setIsLoading(true);
            try {
                // 1. 全件の進捗データを取得
                const data = await adminApi.getProgress();

                // 2. 選択中のテーマに紐づく問題IDリストを取得
                const themeQuestionIds = currentTheme?.questions?.map(q => String(q.questionId)) || [];

                // 3. 選択中のテーマに含まれる問題の進捗だけをフィルタリング
                const filtered = data.filter(item => themeQuestionIds.includes(String(item.questionId)));

                // 4. 並び順をテーマ内の問題順に整える
                const ordered = currentTheme.questions.map(q => {
                    const matched = filtered.find(item => String(item.questionId) === String(q.questionId));
                    return {
                        questionId: q.questionId,
                        questionText: q.questionText,
                        answeredUserCount: matched ? matched.answeredUserCount : 0,
                        totalUserCount: matched ? matched.totalUserCount : (data[0]?.totalUserCount || 0),
                        uncompletedUsers: matched ? matched.uncompletedUsers : []
                    };
                });

                setProgressList(ordered);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentTheme) {
            fetchProgress();
        }
    }, [currentTheme]); // 💡 currentThemeが変わるたびに実行される

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