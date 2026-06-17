import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import Sidebar from "../components/main_screen/Sidebar";
import MainContent from "../components/main_screen/MainContent";

export default function MainScreen() {
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // =========================
  // Safe styles
  // =========================
  const baseStyles = {
    wrapper: { display: "flex", height: "100vh", fontFamily: "sans-serif", overflow: "hidden" },
    sidebar: { width: 340, borderRight: "1px solid #ddd", padding: 10, backgroundColor: "#fff" },
    topBar: { display: "flex", gap: 8, marginBottom: 10 },
    search: { flex: 1, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6 },
    logout: { padding: "6px 10px", border: "1px solid #ddd", background: "#fff" },
    filterRow: { display: "flex", gap: 8 },
    filterButton: { padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd" },
    theme: {
      padding: 10,
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
      justifyContent: "flex-start",
      textAlign: "left",
    },
    progressBg: { height: 4, background: "#eee", borderRadius: 10 },
    progressBar: { height: 4, borderRadius: 10 },
    progressText: { fontSize: 11, marginTop: 3, textAlign: "center" },
    question: { padding: "6px 10px", fontSize: 13, cursor: "pointer" },
    main: { flex: 1, padding: 20, overflowY: "auto" },
    card: { border: "1px solid #ddd", padding: 20, borderRadius: 8 },
    textarea: { width: "100%", height: 120 },
    save: { marginTop: 10, padding: "6px 14px", border: "1px solid #ccc" },
    box: { background: "#f3f4f6", padding: 10, marginTop: 8, borderRadius: 6 },
  };

  const styles = baseStyles;

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
  const [saved, setSaved] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);
  const [otherAnswers, setOtherAnswers] = useState([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // サイドバー開閉ステート
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // =========================
  // Effects
  // =========================
  useEffect(() => {
    if (!userId) navigate("/login", { replace: true });
  }, [userId, navigate]);

  // ブラウザの「戻る」「閉じる」対策
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "未保存の内容がありますが、破棄して移動しますか？";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [draftAnswer, answerMap, activeQuestion]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const data = await userApi.getThemes();
        setThemes(data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const data = await userApi.getMyAnswers(userId);
        const map = {};
        (data || []).forEach((a) => {
          const qid = a.questionId ?? a.question_id;
          if (!qid) return;
          map[String(qid)] = a;
        });
        setAnswerMap(map);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!activeQuestion || !userId) return;

    const qid = activeQuestion.questionId ?? activeQuestion.question_id;

    (async () => {
      try {
        const data = await userApi.getOtherAnswers(qid);
        setOtherAnswers((data || []).filter((a) => a.userId !== userId));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [activeQuestion, userId]);

  // ★質問が変わった時に各種サブコンテンツのフラグをリセットする処理
  useEffect(() => {
    if (!activeQuestion) return;

    // 1. 下書き回答の同期
    const qid = activeQuestion.questionId ?? activeQuestion.question_id;
    setDraftAnswer(answerMap[String(qid)]?.answerContent || "");

    // 2. 開いていた「他の人の回答」「お手本」「レビュー」を自動で閉じる
    setIsAnswersOpen(false);
    setIsModelOpen(false);
    setIsReviewOpen(false);
  }, [activeQuestion, answerMap]);

  // =========================
  // Helpers
  // =========================
  const getQid = () =>
    activeQuestion?.questionId ?? activeQuestion?.question_id;

  const isDirty =
    activeQuestion &&
    draftAnswer !== (answerMap[String(getQid())]?.answerContent || "");

  const handleSelectQuestion = (q) => {
    if (isDirty && !window.confirm("未保存の内容があります。移動しますか？")) {
      return;
    }
    setActiveQuestion(q);
  };

  const handleSave = async () => {
    const qid = getQid();
    if (!qid) return;

    try {
      const res = await userApi.upsertAnswer(userId, qid, draftAnswer);

      setAnswerMap((prev) => ({
        ...prev,
        [String(qid)]: {
          answerId: res.answerId,
          answerContent: res.answerContent,
        },
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch (e) {
      console.error(e);
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

  // =========================
  // Filtering
  // =========================
  const hideEmpty = searchQuery.trim().length > 0;

  const filteredThemes = themes
    .map((theme) => {
      const questions = (theme.questions || [])
        .filter((q) => {
          const qid = q.questionId ?? q.question_id;
          const has = !!answerMap[String(qid)];

          if (statusFilter === "completed") return has;
          if (statusFilter === "uncompleted") return !has;
          return true;
        })
        .filter((q) =>
          searchQuery
            ? q.questionText?.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        );

      return { ...theme, questions, _count: questions.length };
    })
    .filter((t) => (!hideEmpty ? true : (t._count ?? 0) > 0));

  if (!userId) return <div>loading...</div>;

  // =========================
  // Layout styles
  // =========================
  const dynamicWrapperStyle = {
    ...styles.wrapper,
    position: "relative",
  };

  const dynamicSidebarStyle = {
    ...styles.sidebar,
    width: isSidebarOpen ? 340 : 0,
    minWidth: isSidebarOpen ? 340 : 0,
    padding: isSidebarOpen ? 10 : 0, 
    borderRight: isSidebarOpen ? "1px solid #ddd" : "none",
    overflowX: "hidden", 
    overflowY: isSidebarOpen ? "auto" : "hidden",
    visibility: isSidebarOpen ? "visible" : "hidden", 
    transition: "width 0.25s ease, padding 0.25s ease, visibility 0.25s",
    position: "relative",
  };

  // 三本線（☰）ボタン：常にサイドバーの右エッジの「外側」に配置
  const toggleButtonStyle = {
    position: "absolute",
    left: isSidebarOpen ? 348 : 12, 
    top: 12,
    zIndex: 1010, 
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    fontSize: "18px",
    lineHeight: 1,
    transition: "left 0.25s ease, background-color 0.2s",
  };

  return (
    <div style={dynamicWrapperStyle}>
      {/* 1. 三本線ボタン */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={toggleButtonStyle}
        title={isSidebarOpen ? "メニューを閉じる" : "メニューを開く"}
      >
        ☰
      </button>

      {/* 2. サイドバー */}
      <Sidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setUserId={setUserId}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredThemes={filteredThemes}
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
          sidebar: dynamicSidebarStyle,
        }}
      />

      {/* 3. メインコンテンツ */}
      <MainContent
        activeQuestion={activeQuestion}
        textareaRef={textareaRef}
        draftAnswer={draftAnswer}
        setDraftAnswer={setDraftAnswer}
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
            ...(styles.main || {}),
            paddingLeft: isSidebarOpen ? 20 : 56, 
            paddingTop: 20,
            transition: "padding-left 0.25s ease",
          },
        }}
      />
    </div>
  );
}