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
                const result = await response.json();

                if (result.status === "success" && result.data) {
                    setThemes(result.data);
                    if (result.data.length > 0) {
                        const firstTheme = result.data[0];
                        setActiveThemeId(firstTheme.pdfId);
                        if (firstTheme.questions && firstTheme.questions.length > 0) {
                            setActiveQuestionId(firstTheme.questions[0].questionId);
                        }
                    }
                }
            } catch (error) {
                console.error("DBからの取得に失敗したため、一時的にモックデータをロードします:", error);
                // エラー時のセーフティネットとしてモックをロード
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
                    name: "スライド1：プログラミング基礎（ローカルデータ）",
                    questions: [
                        { questionId: 101, content: "変数の宣言とは何ですか？その目的も含めて説明してください。", modelAnswer: "データを格納するメモリ上の領域に名前をつけること。" },
                        { questionId: 102, content: "データ型の種類を挙げてください。", modelAnswer: "int, String, booleanなど。" }
                    ]
                },
                {
                    pdfId: 2,
                    name: "スライド2：SQL基礎（ローカルデータ）",
                    questions: [
                        { questionId: 201, content: "SELECT文の基本構成を書いてください。", modelAnswer: "SELECT カラム名 FROM テーブル名 WHERE 条件;" }
                    ]
                }
            ];

            // 状態（State）にモックデータをそのまま直注入
            setThemes(mockThemes);
            setActiveThemeId(1);      // 最初のテーマ（スライド1）を強制選択
            setActiveQuestionId(101); // 最初の問題（101）を強制選択
        };

        // 💡 👇【切り替えスイッチ】通常時はDB接続。データを通したくないときはここを「loadMockData();」に変えるだけ！
        //fetchThemesFromDB(); // ← データベースから取得する場合
        loadMockData();    // ← API通信を完全にスルーしてフロントだけで動かす場合

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

    const handleAddTheme = (themeName) => {
        const newId = Date.now();
        setThemes([...themes, { pdfId: newId, name: themeName, questions: [] }]);
    };

    const handleDeleteTheme = (deletedThemeId) => {
        const updatedThemes = themes.filter(t => t.pdfId !== deletedThemeId);
        setThemes(updatedThemes);

        if (activeThemeId === deletedThemeId && updatedThemes.length > 0) {
            setActiveThemeId(updatedThemes[0].pdfId);
            if (updatedThemes[0].questions?.length > 0) {
                setActiveQuestionId(updatedThemes[0].questions[0].questionId);
            } else {
                setActiveQuestionId(null);
            }
        }
    };

    const handleUpdateTheme = (targetThemeId, newName) => {
        setThemes(themes.map(t =>
            t.pdfId === targetThemeId ? { ...t, name: newName } : t
        ));
    };

    // ➕ 問題追加の処理（API通信版 ＆ モック版切り替え可能コード）
    const handleAddQuestion = async (targetThemeId) => {

        // ==========================================
        // 🟢 パターンA：データベース（API）に問題を新規追加するリアルバージョン
        // ==========================================
        const addQuestionToDB = async () => {
            try {
                // API設計書に沿って POST /api/questions を叩く
                // ※ エンドポイントが `POST /api/themes/${targetThemeId}/questions` のパターンの場合はURLを調整してください
                const response = await fetch("http://localhost:8080/api/questions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // バックエンドのEntityやDTOのキー名（themeId, content, modelAnswerなど）に合わせて送信
                    body: JSON.stringify({
                        pdfId: targetThemeId, // どのテーマに紐づけるか
                        content: "新しい問題内容",
                        modelAnswer: "模範解答をここに入力"
                    }),
                });

                const result = await response.json();

                if (result.status === "success" && result.data) {
                    // バックエンドからDBで自動採番された本物の「questionId」が入ったデータが返ってくる想定
                    const dbNewQuestion = result.data; // 例: { questionId: 205, content: "...", modelAnswer: "..." }

                    // 親のState（themes）に反映
                    setThemes(themes.map(t =>
                        t.pdfId === targetThemeId
                            ? { ...t, questions: [...(t.questions || []), dbNewQuestion] }
                            : t
                    ));

                    // 追加した新しい問題を即座に選択状態（編集画面）にする
                    handleSelectQuestion(targetThemeId, dbNewQuestion.questionId, "edit");
                } else {
                    alert("問題の追加に失敗しました: " + result.message);
                }
            } catch (error) {
                console.error("問題追加APIとの通信に失敗したため、一時的にローカルで追加します:", error);
                // サーバーが落ちている時はセーフティネットとしてローカル版を走らせる
                addQuestionLocal();
            }
        };

        // ==========================================
        // 🟡 パターンB：データを通さない（API通信しない）モックバージョン
        // ==========================================
        const addQuestionLocal = () => {
            const newQId = Date.now(); // 仮のIDをタイムスタンプで生成
            const mockNewQuestion = {
                questionId: newQId,
                content: "新しい問題内容（ローカル追加）",
                modelAnswer: "模範解答をここに入力"
            };

            // フロントのStateのみを更新
            setThemes(themes.map(t =>
                t.pdfId === targetThemeId
                    ? { ...t, questions: [...(t.questions || []), mockNewQuestion] }
                    : t
            ));

            // 追加した仮の問題を選択状態にする
            handleSelectQuestion(targetThemeId, newQId, "edit");
        };

        // 💡 👇【切り替えスイッチ】データを通したくないときはここを「addQuestionLocal();」に変えるだけ！
        await addQuestionToDB(); // ← データベースに保存する場合
        // addQuestionLocal();    // ← API通信を完全にスルーしてフロントだけで動かす場合
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
                    <div style={{ fontSize: "14px", color: "#666" }}>選択中：<strong>{currentTheme?.name || "テーマがありません"}</strong></div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => setActiveTab("edit")} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "edit" ? "#0066cc" : "#fff", color: activeTab === "edit" ? "#fff" : "#333" }}>📝 問題の編集</button>
                        <button onClick={() => setActiveTab("progress")} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: activeTab === "progress" ? "#28a745" : "#fff", color: activeTab === "progress" ? "#fff" : "#333" }}>📊 受講者進捗確認</button>
                    </div>
                </div>

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