import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import Sidebar from "../components/main_screen/Sidebar";
import MainContent from "../components/main_screen/MainContent";

export default function MainScreen() {
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const answerFileInputRef = useRef(null);

  // =========================
  // States
  // =========================
  const [userId, setUserId] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? Number(JSON.parse(saved).userId) : null;
    } catch {
      return null;
    }
  });

  const [themes, setThemes] = useState([]);
  const [openThemes, setOpenThemes] = useState(new Set());
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [answerMap, setAnswerMap] = useState({});
  const [draftAnswer, setDraftAnswer] = useState("");
  const [draftAnswerImagePath, setDraftAnswerImagePath] = useState("");
  const [saved, setSaved] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);
  const [otherAnswers, setOtherAnswers] = useState([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // サイドバーの開閉状態
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // =========================
  // Effects & Logic
  // =========================
  useEffect(() => {
    if (!userId) navigate("/login", { replace: true });
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;
    const loadThemes = async () => {
      try {
        const data = await userApi.getThemes();
        setThemes(data || []);
      } catch (error) {
        console.error("テーマ取得エラー:", error);
      }
    };
    loadThemes();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const loadMyAnswers = async () => {
      try {
        const data = await userApi.getMyAnswers(userId);
        const map = {};
        if (Array.isArray(data)) {
          data.forEach((a) => {
            const qid = a.questionId ?? a.question_id;
            if (!qid) return;
            map[String(qid)] = {
              answerId: a.answerId,
              questionId: qid,
              answerContent: a.answerContent ?? "",
              imagePath: a.imagePath ?? "",
            };
          });
        }
        setAnswerMap(map);
      } catch (error) {
        console.error("回答取得エラー:", error);
      }
    };
    loadMyAnswers();
  }, [userId]);

  useEffect(() => {
    if (!activeQuestion || !userId) return;
    const qid = activeQuestion.questionId ?? activeQuestion.question_id;
    const loadOtherAnswers = async () => {
      try {
        const data = await userApi.getOtherAnswers(qid);
        if (Array.isArray(data)) {
          const filtered = data.filter((a) => a.userId !== userId);
          setOtherAnswers(filtered);
        }
      } catch (error) {
        console.error("他人の回答取得エラー:", error);
      }
    };
    loadOtherAnswers();
  }, [userId, activeQuestion]);

  useEffect(() => {
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId ?? activeQuestion.question_id;
    setDraftAnswer(answerMap[String(qid)]?.answerContent || "");
    setDraftAnswerImagePath(answerMap[String(qid)]?.imagePath || "");

    if (answerFileInputRef.current) {
      answerFileInputRef.current.value = "";
    }
  }, [activeQuestion, answerMap]);

  const getQid = () => activeQuestion?.questionId ?? activeQuestion?.question_id;

  const isDirty =
    activeQuestion &&
    draftAnswer !== (answerMap[String(getQid())]?.answerContent || "");

  const handleSelectQuestion = (q) => {
    if (isDirty) {
      if (!window.confirm("未保存の内容があります。移動しますか？")) return;
    }
    setActiveQuestion(q);
  };

  const handleSave = async () => {
    const qid = getQid();
    if (!qid) return;
    try {
      const res = await userApi.upsertAnswer(
        userId,
        qid,
        draftAnswer,
        draftAnswerImagePath
      );
      setAnswerMap((prev) => ({
        ...prev,
        [String(qid)]: {
          answerId: res.answerId,
          answerContent: res.answerContent,
          imagePath: res.imagePath || "",
        },
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnswerImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/upload/answer", {
        method: "POST",
        body: formData,
      });
      const path = await response.text();
      setDraftAnswerImagePath(path);
    } catch (error) {
      console.error(error);
      alert("回答画像のアップロードに失敗しました");
    }
  };

  const getProgress = (theme) => {
    const qs = theme.questions || [];
    const done = qs.filter((q) => {
      const qid = q.questionId ?? q.question_id;
      return (answerMap[String(qid)]?.answerContent || "").trim().length > 0;
    }).length;
    return { done, total: qs.length };
  };

  const getProgressColor = (ratio) => {
    if (ratio < 0.3) return "#ef4444";
    if (ratio < 0.7) return "#f59e0b";
    return "#22c55e";
  };

  // FILTER + SEARCH + EMPTY FOLDER FIX
  const hideEmpty = searchQuery.trim().length > 0;
  const filteredThemes = themes
    .map((theme) => {
      // 1. 質問を検索ワードで絞り込む
      const filteredQuestions = (theme.questions || []).filter((q) => {
        const qid = q.questionId ?? q.question_id;
        const has = !!answerMap[String(qid)];

        // ステータスフィルターの判定
        if (statusFilter === "completed" && !has) return false;
        if (statusFilter === "uncompleted" && has) return false;

        // 検索ワードの判定
        if (searchQuery) {
          return q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      });

      // 2. テーマ自体を表示するかどうかの判定
      const isThemeMatch = theme.title.toLowerCase().includes(searchQuery.toLowerCase());

      return {
        ...theme,
        // 💡 修正：テーマタイトルがマッチしていれば全問題を表示、そうでなければ絞り込んだ質問を表示
        questions: isThemeMatch ? (theme.questions || []) : filteredQuestions,
        _count: isThemeMatch ? (theme.questions || []).length : filteredQuestions.length
      };
    })
    .filter((theme) => {
      // 最終的に、テーマ名にマッチするか、または質問が残っているテーマだけを残す
      const isThemeMatch = theme.title.toLowerCase().includes(searchQuery.toLowerCase());
      return isThemeMatch || (theme._count ?? 0) > 0;
    });
  if (!userId) return <div>loading...</div>;

  const sortedThemes = [...filteredThemes].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );
  // 開閉状態に合わせて動的にオーバーライドするスタイル
  const dynamicWrapperStyle = {
    ...styles.wrapper,
    position: "relative", // ☰ ボタンを浮かせる基準にする
  };

  const dynamicSidebarStyle = {
    ...styles.sidebar,
    width: isSidebarOpen ? 340 : 0,
    padding: isSidebarOpen ? 10 : "10px 0px",
    // 💡 【修正】縦スクロール（Y軸）を有効化し、横（X軸）の溢れだけを綺麗に隠す
    overflowY: isSidebarOpen ? "auto" : "hidden",
    overflowX: "hidden",
    transition: "width 0.25s ease-in-out, padding 0.25s ease-in-out",
    borderRight: isSidebarOpen ? styles.sidebar.borderRight : "none",
  };

  return (
    <div style={dynamicWrapperStyle}>

      {/* サイドバーが閉じているときだけ、画面左上に現れる「開く」三本線ボタン */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{
            position: "absolute",
            left: "16px",
            top: "16px",
            zIndex: 50,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "20px",
            padding: "4px 10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}
          title="サイドバーを開く"
        >
          ☰
        </button>
      )}

      {/* 👈 左側：Sidebar（条件レンダリングせず、スタイルのみ介入） */}
      <Sidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setUserId={setUserId}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredThemes={sortedThemes}
        openThemes={openThemes}
        setOpenThemes={setOpenThemes}
        answerMap={answerMap}
        handleSelectQuestion={handleSelectQuestion}
        getProgress={getProgress}
        getProgressColor={getProgressColor}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        styles={{
          ...styles,
          sidebar: dynamicSidebarStyle // 動的なスタイルで上書き
        }}
      />

      {/* 👉 右側：MainContent */}
      <MainContent
        activeQuestion={activeQuestion}
        textareaRef={textareaRef}
        answerFileInputRef={answerFileInputRef}
        draftAnswer={draftAnswer}
        setDraftAnswer={setDraftAnswer}
        draftAnswerImagePath={draftAnswerImagePath}
        handleAnswerImageUpload={handleAnswerImageUpload}
        handleSave={handleSave}
        saved={saved}
        isModelOpen={isModelOpen}
        setIsModelOpen={setIsModelOpen}
        isAnswersOpen={isAnswersOpen}
        setIsAnswersOpen={setIsAnswersOpen}
        isReviewOpen={isReviewOpen}
        setIsReviewOpen={setIsReviewOpen}
        otherAnswers={otherAnswers}
        answerMap={answerMap}
        getQid={getQid}
        styles={{
          ...styles,
          main: {
            ...styles.main,
            // ボタンと文字が被らないように、閉じている時だけ左余白を広げる
            paddingLeft: isSidebarOpen ? 20 : 60,
            transition: "padding-left 0.25s ease-in-out",
          }
        }}
      />
    </div>
  );
}

/* styles - 元のコードと100%全く同じものを完全維持 */
const styles = {
  wrapper: { display: "flex", height: "100vh", fontFamily: "sans-serif" },
  sidebar: { width: 340, borderRight: "1px solid #ddd", padding: 10 },
  topBar: { display: "flex", gap: 8, marginBottom: 10 },
  search: { flex: 1, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6 },
  logout: { padding: "6px 10px", border: "1px solid #ddd", background: "#fff" },
  filterRow: { display: "flex", gap: 8 },
  filterButton: { padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd" },
  theme: {
    padding: 10, borderRadius: 6, cursor: "pointer", fontWeight: "bold",
    justifyContent: "flex-start", // 👈 これで左寄せになる
    textAlign: "left"         // テキスト自体も左寄せにする（念のため）},
  },
  progressBg: { height: 4, background: "#eee", borderRadius: 10 },
  progressBar: { height: 4, borderRadius: 10 },
  progressText: { fontSize: 11, marginTop: 3, textAlign: "center" },
  question: { padding: "6px 10px", fontSize: 13, cursor: "pointer" },
  main: { flex: 1, padding: 20 },
  card: { border: "1px solid #ddd", padding: 20, borderRadius: 8 },
  textarea: { width: "100%", height: 120 },
  save: { marginTop: 10, padding: "6px 14px", border: "1px solid #ccc" },
  box: { background: "#f3f4f6", padding: 10, marginTop: 8, borderRadius: 6 },
};