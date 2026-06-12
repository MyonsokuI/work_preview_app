import { userApi } from "../api/userApi";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GeneralReview from "../components/general_review";

const FILTERS = [
  { key: "all", label: "すべて" },
  { key: "completed", label: "完了" },
  { key: "uncompleted", label: "未完了" },
];

export default function MainScreen() {
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const [userId, setUserId] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      if (saved) {
        const obj = JSON.parse(saved);
        return obj.userId ? Number(obj.userId) : null;
      }
    } catch { }
    return null;
  });

  const [themes, setThemes] = useState([]);
  const [openThemes, setOpenThemes] = useState(new Set());
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [answerMap, setAnswerMap] = useState({});
  const [saved, setSaved] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);
  const [otherAnswers, setOtherAnswers] = useState([]);

  // --- 再取得用ロジック ---
  const refreshMyAnswers = async () => {
    if (!userId) return;
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
      console.error("回答再取得エラー:", error);
    }
  };

  // --- useEffects ---
  useEffect(() => {
    if (!userId) navigate("/login", { replace: true });
  }, [userId, navigate]);

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const data = await userApi.getThemes();
        setThemes(data);
      } catch (error) {
        console.error("テーマ取得エラー:", error);
      }
    };
    loadThemes();
    refreshMyAnswers();
  }, [userId]);

  useEffect(() => {
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId ?? activeQuestion.question_id;
    const loadOtherAnswers = async () => {
      try {
        const data = await userApi.getOtherAnswers(qid);
        if (Array.isArray(data)) {
          setOtherAnswers(data.filter((a) => a.userId !== userId));
        }
      } catch (error) {
        console.error("他人の回答取得エラー:", error);
      }
    };
    loadOtherAnswers();
    setIsModelOpen(false);
    setIsAnswersOpen(false);
  }, [activeQuestion, userId]);

  // --- Actions ---
  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      localStorage.clear();
      setUserId(null);
    }
  };

  const toggleTheme = (themeId) => {
    setOpenThemes((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  };

  const handleSave = async () => {
    if (!activeQuestion || !userId) return;
    const qid = activeQuestion.questionId ?? activeQuestion.question_id;
    const content = textareaRef.current?.value || "";
    try {
      await userApi.upsertAnswer(userId, qid, content);
      await refreshMyAnswers();
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch (e) {
      console.error("保存失敗:", e);
      alert("保存に失敗しました");
    }
  };

  const getProgress = (theme) => {
    const qs = theme.questions || [];
    const done = qs.filter((q) => answerMap[String(q.questionId ?? q.question_id)]).length;
    return { done, total: qs.length };
  };

  if (!userId) return <div>loading...</div>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <div style={styles.topBar}>
          <input style={styles.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="検索" />
          <button onClick={handleLogout} style={styles.logout}>ログアウト</button>
        </div>
        <div style={styles.filterRow}>
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{ ...styles.filterButton, background: statusFilter === f.key ? "#2563eb" : "#f3f4f6", color: statusFilter === f.key ? "#fff" : "#111" }}>
              {f.label}
            </button>
          ))}
        </div>

        {themes.map((theme) => {
          const themeId = theme.pdfId;
          const isOpen = openThemes.has(themeId);
          const { done, total } = getProgress(theme);
          return (
            <div key={themeId}>
              <div onClick={() => toggleTheme(themeId)} style={{ ...styles.theme, background: isOpen ? "#eef6ff" : "" }}>
                📁 {theme.title}
                <div style={styles.progressText}>{done}/{total}</div>
                <div style={styles.progressBg}><div style={{ ...styles.progressBar, width: total ? `${(done / total) * 100}%` : "0%" }} /></div>
              </div>
              {isOpen && theme.questions?.filter((q) => {
                const has = !!answerMap[String(q.questionId ?? q.question_id)];
                if (statusFilter === "completed") return has;
                if (statusFilter === "uncompleted") return !has;
                return true;
              }).filter((q) => q.questionText.toLowerCase().includes(searchQuery.toLowerCase())).map((q) => {
                const qid = q.questionId ?? q.question_id;
                return (
                  <div key={qid} onClick={() => setActiveQuestion(q)} style={styles.question}>
                    📝 {q.questionText} {answerMap[String(qid)] && <span style={{ color: "#22c55e" }}>✔</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div style={styles.main}>
        {!activeQuestion ? (<div>問題を選択してください</div>) : (
          <div style={styles.card}>
            <h3>{activeQuestion.questionText}</h3>
            <textarea ref={textareaRef} style={styles.textarea} defaultValue={answerMap[String(activeQuestion.questionId ?? activeQuestion.question_id)]?.answerContent || ""} />
            <button onClick={handleSave} style={styles.save}>保存 {saved && "✔"}</button>

            <div>
              <b onClick={() => setIsModelOpen(!isModelOpen)}>模範解答 {isModelOpen ? "▲" : "▼"}</b>
              {isModelOpen && <div style={styles.box}>{activeQuestion.correctAnswer}</div>}
            </div>

            <div>
              <b onClick={() => setIsAnswersOpen(!isAnswersOpen)}>他の人の回答 {isAnswersOpen ? "▲" : "▼"}</b>
              {isAnswersOpen && <div>{otherAnswers.map((a) => <div key={a.answerId} style={styles.box}>{a.userName || "user"}: {a.answerContent}</div>)}</div>}
            </div>

            <div style={{ marginTop: "40px" }}>
              <GeneralReview answerId={answerMap[String(activeQuestion.questionId ?? activeQuestion.question_id)]?.answerId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", height: "100vh", fontFamily: "sans-serif" },
  sidebar: { width: 340, borderRight: "1px solid #ddd", padding: 10, overflowY: "auto" },
  topBar: { display: "flex", gap: 8, marginBottom: 10 },
  search: { flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" },
  logout: { padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: "bold" },
  filterRow: { display: "flex", gap: 8, marginBottom: 10 },
  filterButton: { padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer", fontSize: 12, fontWeight: "bold" },
  theme: { padding: 10, borderRadius: 6, cursor: "pointer", fontWeight: "bold" },
  progressBg: { height: 4, background: "#eee", borderRadius: 10 },
  progressBar: { height: 4, background: "#4ade80", borderRadius: 10 },
  progressText: { fontSize: 11, marginTop: 3 },
  question: { padding: "6px 10px", display: "flex", justifyContent: "space-between", fontSize: 13, cursor: "pointer" },
  main: { flex: 1, padding: 20, overflowY: "auto" },
  card: { border: "1px solid #ddd", padding: 20, borderRadius: 8 },
  textarea: { width: "100%", height: 120, marginTop: 10 },
  save: { marginTop: 10, padding: "6px 14px", borderRadius: 6, border: "1px solid #ccc", background: "#f8fafc", cursor: "pointer", fontWeight: "bold" },
  box: { background: "#f3f4f6", padding: 10, marginTop: 8, borderRadius: 6 }
};