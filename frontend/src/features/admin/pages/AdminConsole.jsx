import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import QuestionEditor from "../components/questioneditor/QuestionEditor";
import ProgressChecker from "../components/progresschecker/ProgressChecker";
import ReviewPanel from "../components/reviewPanel/ReviewPanel";
import { adminApi } from "../api/adminApi"; // 💡 作成したAPIサービスをインポート

export default function AdminConsole() {
    const [themes, setThemes] = useState([]);
    const navigate = useNavigate();

    const [activeThemeId, setActiveThemeId] = useState(null);
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [activeTab, setActiveTab] = useState("edit");
    const [creatingQuestion, setCreatingQuestion] = useState(null);

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

    // 新しいハンドラを作成
    const handleShowThemeProgress = (themeId) => {
        setActiveThemeId(themeId);
        setActiveTab("progress"); // 💡 進捗タブを強制的に選択
        setCreatingQuestion(null); // 新規作成モードは解除
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

    const updateStatus = async (id, status) => {
  await fetch(`http://localhost:8080/api/themes/${id}/status?status=${status}`, {
    method: "PUT",
  });

  alert("ステータス更新しました");
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

    // 💡 スクロール用の ref を追加
    const scrollAreaRef = useRef(null);

    // 💡 選択項目やタブが変わったら一番上にスクロールする
    useEffect(() => {
        // コンテナの中身をリセットするのではなく、ウィンドウのスクロール位置をリセットする
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeThemeId, activeQuestionId, activeTab]);

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
            <AdminSidebar
                themes={themes}
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
                onShowProgress={handleShowThemeProgress} // 💡 渡す
            />

            <div style={{ flex: 1, padding: "24px", backgroundColor: "#fff", overflowY: "auto", minHeight: "100vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                    <div style={{ fontSize: "14px", color: "#666", display: "flex", alignItems: "center", gap: "8px" }}>
                        選択中：
                        <strong>{currentTheme?.title || "テーマを選択してください"}</strong>

                        {currentTheme?.status && (
                            <span
                                style={{
                                    fontSize: "12px",
                                    padding: "2px 8px",
                                    borderRadius: "999px",
                                    fontWeight: "bold",
                                    background:
                                        currentTheme.status === "published" ? "#dcfce7" : "#fef3c7",
                                    color:
                                        currentTheme.status === "published" ? "#166534" : "#92400e",
                                }}
                            >
                                {currentTheme.status === "published" ? "公開中" : "非公開"}
                            </span>
                        )}
                    </div>
                    {(currentTheme?.questions?.length > 0 || creatingQuestion) && (
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => { setCreatingQuestion(null); setActiveTab("edit"); }} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "edit" ? "#0066cc" : "#fff", color: activeTab === "edit" ? "#fff" : "#333" }}>📝 問題の編集</button>
                            <button onClick={() => setActiveTab("review")} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "review" ? "#a7a528" : "#fff", color: activeTab === "review" ? "#fff" : "#333" }}>💬 レビュー</button>
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
                        {activeTab === "progress" && <ProgressChecker currentTheme={currentTheme} />}
                        {activeTab === "review" && (
                            <ReviewPanel
                                theme={currentTheme}
                                questionId={activeQuestionId}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}