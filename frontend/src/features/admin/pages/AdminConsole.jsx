import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import QuestionEditor from "../components/questioneditor/QuestionEditor";
import ProgressChecker from "../components/progresschecker/ProgressChecker";
import ReviewPanel from "../components/reviewPanel/ReviewPanel";
import ThemeEditor from "../components/ThemeEditor/ThemeEditor";
import { adminApi } from "../api/adminApi"; // 💡 作成したAPIサービスをインポート

export default function AdminConsole() {
    const [themes, setThemes] = useState([]);
    const navigate = useNavigate();

    const [activeThemeId, setActiveThemeId] = useState(null);
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [activeTab, setActiveTab] = useState("edit");
    const [creatingQuestion, setCreatingQuestion] = useState(null);

    const styles = {
        sidebar: {
            width: 340,
            borderRight: "1px solid #ddd",
            flexShrink: 0 // サイドバーが縮まないようにする
        },
        main: {
            flex: 1,
            padding: "24px",
            backgroundColor: "#fff",
            overflowY: "auto",
            minHeight: "100vh"
        }
    };
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
        setIsEditingTheme(false);   // 💡 編集モードON
        setActiveTab("edit");
        setCreatingQuestion({
            isNew: true,
            pdfId: themeId,
            questionText: "",
            correctAnswer: "",
            status: "draft",
            openAt: "",
            closeAt: "",
            imagePath: ""
        });
    };

    // 共通の再取得用関数
    const refreshThemes = async () => {
        const data = await adminApi.getThemes();
        setThemes(data);
    };
    // 新しいハンドラを作成
    const handleShowThemeProgress = (themeId) => {
        setActiveThemeId(themeId);
        setActiveTab("progress"); // 💡 進捗タブを強制的に選択
        setCreatingQuestion(null); // 新規作成モードは解除
    };

    const handleSelectTheme = (themeId) => {
        setActiveThemeId(themeId);
        setActiveQuestionId(null);
        setCreatingQuestion(null);
        setIsEditingTheme(false);
    };

    const handleSaveQuestion = async (data) => {
        try {
            const body = {
                pdfId: data.pdfId,
                questionText: data.questionText,
                correctAnswer: data.correctAnswer,
                status: data.status,
                openAt: data.openAt ? data.openAt + ":00" : null,
                closeAt: data.closeAt ? data.closeAt + ":00" : null,
                imagePath: data.imagePath || null
            };

            const saved = data.isNew
                ? await adminApi.createQuestion(body)
                : await adminApi.updateQuestion(data.questionId, body);

            // UI状態の更新
            setThemes(themes.map(t => t.pdfId === body.pdfId ? {
                ...t,
                questions: data.isNew ? [...t.questions, saved] : t.questions.map(q => q.questionId === saved.questionId ? saved : q)
            } : t));

            setCreatingQuestion(null);
            setActiveQuestionId(saved.questionId);
            await refreshThemes();
            alert("保存完了しました！");
        } catch (err) {
            console.error(err);
            alert("保存に失敗しました");
        }
    };

    const updateStatus = async (id, status) => {
        await fetch(`http://localhost:8080/api/themes/${id}/status?status=${status}`, {
            method: "PUT",
        });

        alert("ステータス更新しました");
    };

    // handleDeleteQuestion も API を使うように修正する！
    const handleDeleteQuestion = async (tid, qid) => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
            await adminApi.deleteQuestion(qid);
            setThemes(themes.map(t => t.pdfId === tid ? { ...t, questions: t.questions.filter(q => q.questionId !== qid) } : t));
            await refreshThemes();
        } catch (err) {
            alert("削除失敗しました");
        }
    };

    // AdminConsole.jsx のState定義に追加
    const [isEditingTheme, setIsEditingTheme] = useState(false); // 追加！

    // 💡 1. State を追加
    const [creatingTheme, setCreatingTheme] = useState(null);

    // 💡 2. 新規テーマ作成ボタンのハンドラを作成
    const handleStartAddTheme = () => {
        console.log("fuck");
        setActiveThemeId(null);
        setCreatingQuestion(null);
        setIsEditingTheme(true); // 編集モードON
        setActiveTab(null);
        // 新規作成用の空データをセット
        setCreatingTheme({ isNew: true, title: "", status: "draft", questions: [] });
    };

    // 💡 3. 保存後の処理を修正（既存の handleSaveTheme を上書き）
    const handleSaveTheme = async (savedTheme) => {
        if (creatingTheme?.isNew) {
            setThemes([...themes, savedTheme]); // 新規ならリストに追加
        } else {
            setThemes(themes.map(t => t.pdfId === savedTheme.pdfId ? savedTheme : t));
        }
        await refreshThemes();
        setCreatingTheme(null);   // クリア
        setIsEditingTheme(false); // 編集モード終了
    };
    const targetTheme = creatingTheme || currentTheme;
    // 💡 スクロール用の ref を追加
    const scrollAreaRef = useRef(null);

    // 💡 選択項目やタブが変わったら一番上にスクロールする
    useEffect(() => {
        // コンテナの中身をリセットするのではなく、ウィンドウのスクロール位置をリセットする
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeThemeId, activeQuestionId, activeTab]);

    // 💡 新しいハンドラ：テーマ編集モードへ移行する
    const handleEditTheme = (themeId) => {
        setActiveThemeId(themeId);
        setIsEditingTheme(true);   // 💡 編集モードON
        setCreatingTheme(null);
        setCreatingQuestion(null); // 問題作成などを解除
        setActiveTab(null);        // タブ選択解除
    };

    // 💡 テーマを削除するハンドラ
    const handleDeleteTheme = async (themeId) => {
        if (!window.confirm("このテーマを削除すると、紐付いている問題もすべて削除されます。本当に削除しますか？")) {
            return;
        }

        try {
            await adminApi.deleteTheme(themeId); // 💡 adminApi にこのメソッドがある前提です
            setThemes(themes.filter(t => t.pdfId !== themeId));

            // 削除後に画面をリセット
            setIsEditingTheme(false);
            setCreatingTheme(null);
            setActiveThemeId(null);
            setActiveQuestionId(null);

            alert("テーマを削除しました！");
        } catch (err) {
            console.error(err);
            alert("テーマの削除に失敗しました...");
        }
        await refreshThemes();
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // サイドバーとメインエリアのスタイルを動的に生成
    const dynamicSidebarStyle = {
        ...styles.sidebar,
        width: isSidebarOpen ? 340 : 0,
        overflow: "hidden",
        transition: "width 0.25s ease-in-out",
    };

    const dynamicMainStyle = {
        ...styles.main,
        paddingLeft: isSidebarOpen ? 20 : 60,
        transition: "padding-left 0.25s ease-in-out",
    };
    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", wordBreak: "break-all" }}>
            <AdminSidebar
                themes={themes}
                activeQuestionId={activeQuestionId}
                activeTab={activeTab}
                onSelectQuestion={(tid, qid, tab) => {
                    // 💡 ここが重要：クリックされたら新規作成状態を解除する
                    setIsEditingTheme(false);
                    setCreatingTheme(null);
                    setCreatingQuestion(null);
                    setActiveThemeId(tid);
                    setActiveQuestionId(qid);
                    setActiveTab(tab);
                }}
                onThemeSelect={handleSelectTheme}
                onAddQuestion={handleStartAddQuestion}
                onAddTheme={handleStartAddTheme}
                onLogout={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("currentUser");
                    navigate("/login");
                }}
                onDeleteQuestion={handleDeleteQuestion}
                onThemeEdit={handleEditTheme}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                styles={{ ...styles, sidebar: dynamicSidebarStyle }}
            />

            <div style={{ flex: 1, padding: "24px", backgroundColor: "#fff", overflowY: "auto", minHeight: "100vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "14px" }}>
                    {/* 💡 ここに開くボタンを配置 */}
                    {!isSidebarOpen && (
                        <button onClick={() => setIsSidebarOpen(true)} style={{ cursor: "pointer", background: "#fff", border: "1px solid #dbe3ee", borderRadius: 10, padding: "8px 10px" }}>
                            ☰
                        </button>
                    )}
                    <div style={{ fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", padding: "8px 12px", borderRadius: 999 }}>
                        選択中：
                        <strong style={{ color: "#0f172a" }}>{currentTheme?.title || "テーマを選択してください"}</strong>
                    </div>
                    {currentTheme && (
                        <div style={{ display: "flex", gap: "8px" }}>
                            {/* テーマ設定ボタン */}
                            <button
                                onClick={() => { setIsEditingTheme(true); setCreatingQuestion(null); setActiveTab(null); }}
                                style={{ padding: "9px 14px", cursor: "pointer", borderRadius: 999, border: "1px solid #dbe3ee", backgroundColor: isEditingTheme ? "#0f172a" : "#fff", color: isEditingTheme ? "#fff" : "#334155", fontWeight: 700 }}
                            >
                                ⚙️ テーマ編集
                            </button>

                            {/* 問題がある場合のみ表示されるタブ */}
                            {(currentTheme.questions?.length > 0 || creatingQuestion) && (
                                <>
                                    <button onClick={() => { setIsEditingTheme(false); setCreatingQuestion(null); setActiveTab("edit"); }} style={{ padding: "9px 14px", cursor: "pointer", borderRadius: 999, border: "1px solid #dbe3ee", backgroundColor: (activeTab === "edit" && !isEditingTheme) ? "#2563eb" : "#fff", color: (activeTab === "edit" && !isEditingTheme) ? "#fff" : "#334155", fontWeight: 700 }}>📝 問題の編集</button>
                                    <button onClick={() => { setIsEditingTheme(false); setActiveTab("review"); }} style={{ padding: "9px 14px", cursor: "pointer", borderRadius: 999, border: "1px solid #dbe3ee", backgroundColor: (activeTab === "review" && !isEditingTheme) ? "#f59e0b" : "#fff", color: (activeTab === "review" && !isEditingTheme) ? "#fff" : "#334155", fontWeight: 700 }}>💬 レビュー</button>
                                    <button onClick={() => { setIsEditingTheme(false); setActiveTab("progress"); }} style={{ padding: "9px 14px", cursor: "pointer", borderRadius: 999, border: "1px solid #dbe3ee", backgroundColor: (activeTab === "progress" && !isEditingTheme) ? "#16a34a" : "#fff", color: (activeTab === "progress" && !isEditingTheme) ? "#fff" : "#334155", fontWeight: 700 }}>📊 進捗確認</button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {isEditingTheme ? (
                    <ThemeEditor
                        // 既存の編集なら currentTheme を、新規作成なら creatingTheme を渡す
                        currentTheme={creatingTheme ? creatingTheme : currentTheme}
                        onSave={handleSaveTheme}
                        onCancel={() => {
                            setIsEditingTheme(false);
                            setCreatingTheme(null);
                        }}
                        onDelete={handleDeleteTheme}
                    />
                ) : !currentTheme ? (
                    <div style={{ textAlign: "center", marginTop: "40px", color: "#999" }}>
                        左側のリストからテーマを選択して。
                    </div>
                ) : (!currentTheme.questions || currentTheme.questions.length === 0) && !creatingQuestion ? (
                    <div style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
                        このテーマにはまだ問題がありません。<br />
                        サイドバーから「新しい問題を追加」するか、「テーマ設定」を調整してください！
                    </div>
                ) : (
                    <>
                        {activeTab === "edit" && <QuestionEditor currentQuestion={currentQuestion} onSave={handleSaveQuestion} onDelete={handleDeleteQuestion} onCancel={() => setCreatingQuestion(null)} />}
                        {activeTab === "progress" && <ProgressChecker currentTheme={currentTheme} />}
                        {activeTab === "review" && <ReviewPanel theme={currentTheme} questionId={activeQuestionId} />}
                    </>
                )}
            </div>
        </div>
    );
}