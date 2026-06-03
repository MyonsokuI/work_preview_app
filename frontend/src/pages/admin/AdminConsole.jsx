import { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import QuestionEditor from "../../components/admin/QuestionEditor";
import ProgressChecker from "../../components/admin/ProgressChecker";

export default function AdminConsole() {
    // --- 状態（State）の定義 ---
    const [themes, setThemes] = useState([]);

    const [progressData] = useState({
        1: { completedCount: 12, totalCount: 15, completionRate: 80, uncompletedUsers: [{ userId: 3, name: "鈴木 一郎", remainingCount: 1, lastActive: "2026/05/30" }] },
        2: { completedCount: 5, totalCount: 15, completionRate: 33, uncompletedUsers: [{ userId: 1, name: "山田 太郎", remainingCount: 1, lastActive: "2026/06/01" }] }
    });

    const [activeThemeId, setActiveThemeId] = useState(null);
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [activeTab, setActiveTab] = useState("edit");

    // --- 🔌 データロード処理（API通信版 ＆ モック版切り替え可能コード） ---
    useEffect(() => {
        // ==========================================
        // 🟢 パターンA：データベース（API）からロードするリアルバージョン
        // ==========================================
        const fetchThemesFromDB = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/themes");
                const result = await response.json(); // 直接 [ {...}, {...} ] という配列が返ってくる想定

                if (result && result.length > 0) {
                    setThemes(result);

                    // 初期選択状態の設定
                    const firstTheme = result[0];
                    setActiveThemeId(firstTheme.pdfId);
                    if (firstTheme.questions && firstTheme.questions.length > 0) {
                        setActiveQuestionId(firstTheme.questions[0].questionId);
                    }
                }
            } catch (error) {
                console.error("DBからの取得に失敗したため、一時的にモックデータをロードします:", error);
                loadMockData();
            }
        };

        // ==========================================
        // 🟡 パターンB：データを通さない（API通信しない）モックバージョン
        // ==========================================
        const loadMockData = () => {
            const mockThemes = [
                {
                    pdfId: 1,
                    title: "スライド1：プログラミング基礎（ローカルデータ）",
                    questions: [
                        { questionId: 101, questionText: "変数の宣言とは何ですか？その目的も含めて説明してください。", correctAnswer: "データを格納するメモリ上の領域に名前をつけること。" },
                        { questionId: 102, questionText: "データ型の種類を挙げてください。", correctAnswer: "int, String, booleanなど。" }
                    ]
                },
                {
                    pdfId: 2,
                    title: "スライド2：SQL基礎（ローカルデータ）",
                    questions: [
                        { questionId: 201, questionText: "SELECT文の基本構成を書いてください。", correctAnswer: "SELECT カラム名 FROM テーブル名 WHERE 条件;" }
                    ]
                }
            ];

            setThemes(mockThemes);
            setActiveThemeId(1);
            setActiveQuestionId(101);
        };

        // 💡 切り替えスイッチ
        fetchThemesFromDB();
        // loadMockData();    
    }, []);

    // --- 計算用変数 ---
    const currentTheme = themes.find(t => t.pdfId === activeThemeId) || themes[0];
    const currentQuestion = currentTheme?.questions?.find(q => q.questionId === activeQuestionId);
    const currentProgress = progressData[activeThemeId] || { completedCount: 0, totalCount: 15, completionRate: 0, uncompletedUsers: [] };

    // --- ハンドラ関数 ---
    const handleSelectQuestion = (themeId, qId, tabType) => {
        setActiveThemeId(themeId);
        if (qId) setActiveQuestionId(qId);
        setActiveTab(tabType);
    };

    // 🚀 【重要修正】文字列ではなく、Sidebarから渡される本物のテーマオブジェクトを受け取るように変更
    const handleAddTheme = (newThemeObject) => {
        setThemes([...themes, newThemeObject]);

        // 追加された新規テーマを自動的に選択状態にする
        setActiveThemeId(newThemeObject.pdfId);
        setActiveQuestionId(null); // 新規テーマにはまだ問題がないためnullにする
    };

    const handleDeleteTheme = (deletedThemeId) => {
        const updatedThemes = themes.filter(t => t.pdfId !== deletedThemeId);
        setThemes(updatedThemes);

        // 削除したテーマが現在選択中だった場合の処理を安全に調整
        if (activeThemeId === deletedThemeId) {
            if (updatedThemes.length > 0) {
                const nextTheme = updatedThemes[0];
                setActiveThemeId(nextTheme.pdfId);
                if (nextTheme.questions && nextTheme.questions.length > 0) {
                    setActiveQuestionId(nextTheme.questions[0].questionId);
                } else {
                    setActiveQuestionId(null);
                }
            } else {
                setActiveThemeId(null);
                setActiveQuestionId(null);
            }
        }
    };

    const handleUpdateTheme = (targetThemeId, newName) => {
        setThemes(themes.map(t =>
            t.pdfId === targetThemeId ? { ...t, title: newName } : t
        ));
    };

    // ➕ 問題追加の処理
    const handleAddQuestion = async (targetThemeId) => {
        const addQuestionToDB = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/questions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pdfId: targetThemeId,
                        questionText: "新しい問題内容",
                        correctAnswer: "模範解答をここに入力"
                    }),
                });

                const result = await response.json();
                if (result) {
                    const dbNewQuestion = result;

                    setThemes(themes.map(t =>
                        t.pdfId === targetThemeId
                            ? { ...t, questions: [...(t.questions || []), dbNewQuestion] }
                            : t
                    ));

                    handleSelectQuestion(targetThemeId, dbNewQuestion.questionId, "edit");
                }
            } catch (error) {
                console.error("問題追加APIとの通信に失敗したため、一時的にローカルで追加します:", error);
                addQuestionLocal();
            }
        };

        const addQuestionLocal = () => {
            const newQId = Date.now();
            const mockNewQuestion = {
                questionId: newQId,
                questionText: "新しい問題内容（ローカル追加）",
                correctAnswer: "模範解答をここに入力"
            };

            setThemes(themes.map(t =>
                t.pdfId === targetThemeId
                    ? { ...t, questions: [...(t.questions || []), mockNewQuestion] }
                    : t
            ));

            handleSelectQuestion(targetThemeId, newQId, "edit");
        };

        await addQuestionToDB();
    };

    const handleSaveQuestion = (newContent, newModelAnswer) => {
        setThemes(themes.map(t => t.pdfId === activeThemeId ? {
            ...t,
            questions: t.questions.map(q => q.questionId === activeQuestionId ? { ...q, questionText: newContent, correctAnswer: newModelAnswer } : q)
        } : t));
        alert("変更を保存しました（子から親のStateを更新）");
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", color: "#333" }}>
            <AdminSidebar
                themes={themes}
                activeQuestionId={activeQuestionId}
                activeTab={activeTab}
                onSelectQuestion={handleSelectQuestion}
                onAddQuestion={handleAddQuestion}
                onAddTheme={handleAddTheme}
                onDeleteTheme={handleDeleteTheme}
                onUpdateTheme={handleUpdateTheme}
                onShowProgress={() => setActiveTab("progress")}
            />

            <div style={{ flex: 1, padding: "24px", backgroundColor: "#fff", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                    <div style={{ fontSize: "14px", color: "#666" }}>選択中：<strong>{currentTheme?.title || "テーマがありません"}</strong></div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => setActiveTab("edit")} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "edit" ? "#0066cc" : "#fff", color: activeTab === "edit" ? "#fff" : "#333" }}>📝 問題の編集</button>
                        <button onClick={() => setActiveTab("progress")} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "progress" ? "#28a745" : "#fff", color: activeTab === "progress" ? "#fff" : "#333" }}>📊 受講者進捗確認</button>
                    </div>
                </div>

                {activeTab === "edit" && (
                    <QuestionEditor currentQuestion={currentQuestion} onSave={handleSaveQuestion} />
                )}
                {activeTab === "progress" && (
                    <ProgressChecker currentTheme={currentTheme} />
                )}
            </div>
        </div>
    );
}