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

    // 🟢 問題追加の通信と画面反映の処理にゃ！
    const handleAddQuestion = async (themeId) => {
        try {
            // 1. Java側の QuestionRequest が求めている項目を揃える
            const requestBody = {
                pdfId: themeId,
                questionText: "新しい問題内容",
                correctAnswer: "模範解答"
            };

            // 2. 正しいURL（/api/questions）に POST リクエストを送信
            const response = await fetch("http://localhost:8080/api/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("問題の作成に失敗しましたにゃ");

            // 3. サーバー側（PostgreSQL）からID入りの本物のデータを受け取る
            const savedQuestion = await response.json();

            // 4. 画面（State）をリアルタイム更新するにゃ！
            setThemes(themes.map(t => {
                if (t.pdfId === themeId) {
                    return {
                        ...t,
                        questions: [...(t.questions || []), savedQuestion]
                    };
                }
                return t;
            }));

            // 新しく追加された問題を自動選択状態にして、すぐに編集できるようにするにゃ！
            setActiveQuestionId(savedQuestion.questionId);
            setActiveTab("edit");

            alert("新しい問題を追加しましたにゃ！");

        } catch (error) {
            console.error("問題追加APIとの通信に失敗しましたにゃ:", error);
            alert("サーバーとの通信に失敗しました。ローカルのみの追加は行いませんにゃ。");
        }
    };

    // 💾 問題の変更保存処理（完全に整えた版にゃ！）
    const handleSaveQuestion = (editContent, editModelAnswer) => {
        if (!currentQuestion) {
            alert("編集する問題が選択されていませんにゃ");
            return;
        }

        const targetPdfId = currentTheme?.pdfId || activeThemeId;

        const requestBody = {
            questionText: editContent,
            correctAnswer: editModelAnswer,
            pdfId: targetPdfId
        };

        fetch(`http://localhost:8080/api/questions/${currentQuestion.questionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
            .then((res) => {
                if (!res.ok) throw new Error("サーバー側での問題更新に失敗しましたにゃ");
                return res.json();
            })
            .then((updatedData) => {
                alert("変更を保存しましたにゃ！");

                // 画面上の大元の状態（themes）を、型を崩さずに綺麗に同期する処理にゃ！
                setThemes(themes.map(t => {
                    if (t.pdfId === targetPdfId) {
                        return {
                            ...t,
                            questions: (t.questions || []).map(q =>
                                q.questionId === currentQuestion.questionId
                                    ? { ...q, questionText: updatedData.questionText, correctAnswer: updatedData.correctAnswer }
                                    : q
                            )
                        };
                    }
                    return t;
                }));
            })
            .catch((err) => {
                console.error("更新エラーにゃ:", err);
                alert("エラーが発生しましたにゃ: " + err.message);
            });
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