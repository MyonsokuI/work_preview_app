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
  // Safe styles
  // =========================
  const baseStyles = {
    wrapper: {
      display: "flex",
      height: "100vh",
      fontFamily: "Inter, 'Segoe UI', sans-serif",
      overflow: "hidden",
      background: "#f8fafc",
    },
    sidebar: {
      width: 340,
      borderRight: "1px solid #e2e8f0",
      padding: 12,
      backgroundColor: "#fff",
      boxShadow: "inset -1px 0 0 #f1f5f9",
    },
    topBar: { display: "flex", gap: 8, marginBottom: 10 },
    search: {
      flex: 1,
      padding: "10px 12px",
      border: "1px solid #cbd5e1",
      borderRadius: 10,
      background: "#fff",
    },
    logout: {
      padding: "10px 12px",
      border: "1px solid #dbe3ee",
      background: "#fff",
      borderRadius: 10,
      cursor: "pointer",
      color: "#334155",
    },
    filterRow: { display: "flex", gap: 8, padding: "0 4px 8px" },
    filterButton: {
      padding: "8px 12px",
      borderRadius: 999,
      border: "1px solid #dbe3ee",
      background: "#f8fafc",
      color: "#334155",
      fontWeight: 600,
    },
    theme: {
      padding: 14,
      borderRadius: 12,
      cursor: "pointer",
      fontWeight: 700,
      justifyContent: "flex-start",
      textAlign: "left",
      background: "#fff",
      border: "1px solid #eef2ff",
      marginBottom: 6,
    },
    progressBg: { height: 6, background: "#eef2ff", borderRadius: 999 },
    progressBar: { height: 6, borderRadius: 999 },
    progressText: { fontSize: 11, marginTop: 4, marginBottom: 6, textAlign: "right", color: "#64748b" },
    question: {
      padding: "10px 12px",
      fontSize: 13,
      cursor: "pointer",
      borderRadius: 10,
      color: "#334155",
      margin: "0 0 6px 12px",
      background: "#f8fafc",
    },
    main: { flex: 1, padding: 28, overflowY: "auto", background: "#f8fafc" },
    card: {
      border: "1px solid #e2e8f0",
      padding: 24,
      borderRadius: 16,
      background: "#fff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    },
    textarea: {
      width: "100%",
      height: 150,
      padding: 12,
      borderRadius: 10,
      border: "1px solid #cbd5e1",
      resize: "vertical",
      boxSizing: "border-box",
    },
    save: { marginTop: 10, padding: "10px 16px", border: "1px solid #cbd5e1" },
    box: { background: "#f8fafc", padding: 12, marginTop: 8, borderRadius: 10, border: "1px solid #e2e8f0" },
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
  const [draftAnswerImagePath, setDraftAnswerImagePath] = useState("");
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
    setDraftAnswerImagePath(answerMap[String(qid)]?.imagePath || "");

    if (answerFileInputRef.current) {
      answerFileInputRef.current.value = "";
    }
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

  const isQuestionAnswered = (question) => {
    if (!question) return false;

    const qid = question.questionId ?? question.question_id;
    const answer = answerMap[String(qid)] || {};
    const content = (answer.answerContent || "").trim();
    const imagePath = (answer.imagePath || "").trim();

    return content.length > 0 || imagePath.length > 0;
  };

  const getProgress = (theme) => {
    const qs = theme.questions || [];
    const done = qs.filter((q) => isQuestionAnswered(q)).length;

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
  const filteredThemes = themes
    .map((theme) => {
      const searchText = searchQuery.trim().toLowerCase();
      const themeTitle = (theme.title ?? "").toLowerCase();
      const matchesThemeTitle = !searchText || themeTitle.includes(searchText);

      const visibleQuestions = (theme.questions || []).filter((q) => {
        const questionText = (q.questionText ?? "").toLowerCase();
        const matchesQuestionSearch =
          !searchText || matchesThemeTitle || questionText.includes(searchText);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "completed" && isQuestionAnswered(q)) ||
          (statusFilter === "uncompleted" && !isQuestionAnswered(q));

        return matchesQuestionSearch && matchesStatus;
      });

      const hasVisibleQuestions = visibleQuestions.length > 0;

      const filteredByStatus = (theme.questions || []).filter((q) => {
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "completed" && isQuestionAnswered(q)) ||
          (statusFilter === "uncompleted" && !isQuestionAnswered(q));
        return matchesStatus;
      });

      return {
        ...theme,
        questions: matchesThemeTitle ? filteredByStatus : visibleQuestions,
        _count: matchesThemeTitle ? filteredByStatus.length : visibleQuestions.length,
        matchesThemeTitle,
        hasVisibleQuestions,
      };
    })
    .filter((theme) => {
      if (statusFilter !== "all") {
        return theme.hasVisibleQuestions;
      }
      return theme.matchesThemeTitle || (theme._count ?? 0) > 0;
    });

  if (!userId) return <div>loading...</div>;

  const sortedThemes = [...filteredThemes].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );
  // 開閉状態に合わせて動的にオーバーライドするスタイル
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
          sidebar: dynamicSidebarStyle,
        }}
      />

      {/* 3. メインコンテンツ */}
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