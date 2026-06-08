import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import QuestionEditor from "../components/questioneditor/QuestionEditor";
import ProgressChecker from "../components/progresschecker/ProgressChecker";
import { adminApi } from "../api/adminApi"; // 💡 作成したAPIサービスをインポート

export default function AdminConsole() {
    const [themes, setThemes] = useState([]);
    const navigate = useNavigate();

    const [activeThemeId, setActiveThemeId] = useState(null);
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [activeTab, setActiveTab] = useState("edit");
    const [creatingQuestion, setCreatingQuestion] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);
    // --- データ取得 ---
    useEffect(() => {
        const loadThemes = async () => {
            try {
                const data = await adminApi.getThemes();
                setThemes(data);
            } catch (err) { console.error("テーマ読み込み失敗:", err); }
        };
        loadThemes();
    }, []);

    const currentTheme = themes.find(t => t.pdfId === activeThemeId);
    const currentQuestion = creatingQuestion || currentTheme?.questions?.find(q => q.questionId === activeQuestionId);

    // --- ハンドラ ---
    const handleStartAddQuestion = (themeId) => {
        setActiveThemeId(themeId);
        setActiveQuestionId(null);
        setActiveTab("edit");
        setCreatingQuestion({ isNew: true, pdfId: themeId, questionText: "", correctAnswer: "", status: "draft", openAt: "", closeAt: "" });
    };

    const handleSaveQuestion = async (data) => {
        try {
            const body = {
                pdfId: data.pdfId,
                questionText: data.questionText,
                correctAnswer: data.correctAnswer,
                status: data.status,
                openAt: data.openAt ? data.openAt + ":00" : null,
                closeAt: data.closeAt ? data.closeAt + ":00" : null
            };

            const saved = data.isNew
                ? await adminApi.createQuestion(body.pdfId, body.questionText, body.correctAnswer) // 💡 API経由で作成
                : await adminApi.updateQuestion(data.questionId, body); // 💡 API経由で更新

            // UI状態の更新
            setThemes(themes.map(t => t.pdfId === body.pdfId ? {
                ...t,
                questions: data.isNew ? [...t.questions, saved] : t.questions.map(q => q.questionId === saved.questionId ? saved : q)
            } : t));

            setCreatingQuestion(null);
            setActiveQuestionId(saved.questionId);
            alert("保存完了しましたにゃ！");
        } catch (err) {
            console.error(err);
            alert("保存に失敗しましたにゃ");
        }
    };

    // handleDeleteQuestion も API を使うように修正するにゃ！
    const handleDeleteQuestion = async (tid, qid) => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
            await adminApi.deleteQuestion(qid);
            setThemes(themes.map(t => t.pdfId === tid ? { ...t, questions: t.questions.filter(q => q.questionId !== qid) } : t));
        } catch (err) {
            alert("削除失敗しましたにゃ");
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
            <AdminSidebar
                themes={themes}
                onSelectTheme={setSelectedTheme}
                activeQuestionId={activeQuestionId}
                activeTab={activeTab}
                onSelectQuestion={(tid, qid, tab) => {
                    // 💡 ここが重要：クリックされたら新規作成状態を解除する
                    setCreatingQuestion(null);
                    setActiveThemeId(tid);
                    setActiveQuestionId(qid);
                    setActiveTab(tab);
                }}
                onAddQuestion={handleStartAddQuestion}
                onAddTheme={(t) => setThemes([...themes, t])}
                onLogout={() => navigate("/login")}
                onDeleteQuestion={handleDeleteQuestion}
            />

            <div style={{ flex: 1, padding: "24px", backgroundColor: "#fff", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                    <div style={{ fontSize: "14px", color: "#666" }}>選択中：<strong>{currentTheme?.title || "テーマを選択してください"}</strong></div>

                    {(currentTheme?.questions?.length > 0 || creatingQuestion) && (
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => { setCreatingQuestion(null); setActiveTab("edit"); }} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "edit" ? "#0066cc" : "#fff", color: activeTab === "edit" ? "#fff" : "#333" }}>📝 問題の編集</button>
                            <button onClick={() => setActiveTab("progress")} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "progress" ? "#28a745" : "#fff", color: activeTab === "progress" ? "#fff" : "#333" }}>📊 受講者進捗確認</button>
                        </div>
                    )}
                </div>

                {!currentTheme ? (
                    <div style={{ textAlign: "center", marginTop: "40px", color: "#999" }}>左側のリストからテーマを選択してにゃ。</div>
                ) : (!currentTheme.questions || currentTheme.questions.length === 0) && !creatingQuestion ? (
                    <div style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
                        このテーマにはまだ問題がありません。<br />
                        サイドバーの「➕ 新しい問題を追加」から問題を作成してくださいにゃ！
                    </div>
                ) : (
                    <>
                        {activeTab === "edit" && <QuestionEditor currentQuestion={currentQuestion} onSave={handleSaveQuestion} />}
                        {activeTab === "progress" && <ProgressChecker currentTheme={selectedTheme} />}
                    </>
                )}
            </div>
        </div>
    );
}