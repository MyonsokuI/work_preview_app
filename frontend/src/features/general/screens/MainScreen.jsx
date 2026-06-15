import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import Sidebar from "../components/main_screen/Sidebar";
import MainContent from "../components/main_screen/MainContent";

export default function MainScreen() {
  const navigate = useNavigate();
  const textareaRef = useRef(null);

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
  }, [activeQuestion, userId]);

  useEffect(() => {
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId ?? activeQuestion.question_id;
    setDraftAnswer(answerMap[String(qid)]?.answerContent || "");
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

  // FILTER + SEARCH + EMPTY FOLDER FIX
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
            ? q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        );
      return { ...theme, questions, _count: questions.length };
    })
    .filter((theme) => {
      if (!hideEmpty) return true;
      return (theme._count ?? 0) > 0;
    });

  if (!userId) return <div>loading...</div>;

  return (
    <div style={styles.wrapper}>
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
        styles={styles}
      />

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
        styles={styles}

      />
    </div>
  );
}

/* styles - 全く同じスタイルを維持 */
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