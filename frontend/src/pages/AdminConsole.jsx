import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import QuestionEditor from "../components/admin/QuestionEditor";
import ProgressChecker from "../components/admin/ProgressChecker";

export default function AdminConsole() {
    // --- 状態（State）の定義 ---
    const [themes, setThemes] = useState([
        {
            pdfId: 1,
            name: "スライド1：プログラミング基礎",
            questions: [
                { questionId: 101, content: "変数の宣言とは何ですか？その目的も含めて説明してください。", modelAnswer: "データを格納するメモリ上の領域に名前をつけること。" },
                { questionId: 102, content: "データ型の種類を挙げてください。", modelAnswer: "int, String, booleanなど。" }
            ]
        },
        {
            pdfId: 2,
            name: "スライド2：SQL基礎",
            questions: [
                { questionId: 201, content: "SELECT文の基本構成を書いてください。", modelAnswer: "SELECT カラム名 FROM テーブル名 WHERE 条件;" }
            ]
        }
    ]);

    const [progressData] = useState({
        1: { completedCount: 12, totalCount: 15, completionRate: 80, uncompletedUsers: [{ userId: 3, name: "鈴木 一郎", remainingCount: 1, lastActive: "2026/05/30" }] },
        2: { completedCount: 5, totalCount: 15, completionRate: 33, uncompletedUsers: [{ userId: 1, name: "山田 太郎", remainingCount: 1, lastActive: "2026/06/01" }] }
    });

    const [activeThemeId, setActiveThemeId] = useState(1);
    const [activeQuestionId, setActiveQuestionId] = useState(101);
    const [activeTab, setActiveTab] = useState("edit");

    // --- 計算用変数 ---
    const currentTheme = themes.find(t => t.pdfId === activeThemeId) || themes[0];
    const currentQuestion = currentTheme?.questions.find(q => q.questionId === activeQuestionId);
    const currentProgress = progressData[activeThemeId] || { completedCount: 0, totalCount: 15, completionRate: 0, uncompletedUsers: [] };

    // --- ハンドラ関数（子に渡す処理） ---
    const handleSelectQuestion = (themeId, qId, tabType) => {
        setActiveThemeId(themeId);
        if (qId) setActiveQuestionId(qId);
        setActiveTab(tabType);
    };

    const handleAddTheme = (themeName) => {
        const newId = Date.now();
        setThemes([...themes, { pdfId: newId, name: themeName, questions: [] }]);
    };

    const handleAddQuestion = (targetThemeId) => {
        const newQId = Date.now();
        const newQ = { questionId: newQId, content: "新しい問題内容", modelAnswer: "模範解答をここに入力" };
        setThemes(themes.map(t => t.pdfId === targetThemeId ? { ...t, questions: [...t.questions, newQ] } : t));
        handleSelectQuestion(targetThemeId, newQId, "edit");
    };

    const handleSaveQuestion = (newContent, newModelAnswer) => {
        setThemes(themes.map(t => t.pdfId === activeThemeId ? {
            ...t,
            questions: t.questions.map(q => q.questionId === activeQuestionId ? { ...q, content: newContent, modelAnswer: newModelAnswer } : q)
        } : t));
        alert("変更を保存しました（子から親のStateを更新）");
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", color: "#333" }}>
            {/* 子1: サイドバー */}
            <AdminSidebar
                themes={themes}
                activeQuestionId={activeQuestionId}
                activeTab={activeTab}
                onSelectQuestion={handleSelectQuestion}
                onAddQuestion={handleAddQuestion}
                onAddTheme={handleAddTheme}
                onShowProgress={() => setActiveTab("progress")}
            />

            {/* 右側メインエリア */}
            <div style={{ flex: 1, padding: "24px", backgroundColor: "#fff", overflowY: "auto" }}>
                {/* タブヘッダー */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                    <div style={{ fontSize: "14px", color: "#666" }}>選択中：<strong>{currentTheme?.name}</strong></div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => setActiveTab("edit")} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "edit" ? "#0066cc" : "#fff", color: activeTab === "edit" ? "#fff" : "#333" }}>📝 問題の編集</button>
                        <button onClick={() => setActiveTab("progress")} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "progress" ? "#28a745" : "#fff", color: activeTab === "progress" ? "#fff" : "#333" }}>📊 受講者進捗確認</button>
                    </div>
                </div>

                {/* 子2 & 子3: タブに応じて表示を切り替え */}
                {activeTab === "edit" && (
                    <QuestionEditor currentQuestion={currentQuestion} onSave={handleSaveQuestion} />
                )}
                {activeTab === "progress" && (
                    <ProgressChecker currentTheme={currentTheme} currentProgress={currentProgress} />
                )}
            </div>
        </div>
    );
}