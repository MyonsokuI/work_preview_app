import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080";

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
      if (saved) return JSON.parse(saved).userId || null;
    } catch {}
    return null;
  });

  const [themes, setThemes] = useState([]);
  const [openThemes, setOpenThemes] = useState(new Set());
  const [activeQuestion, setActiveQuestion] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [answerMap, setAnswerMap] = useState({});
  const [savedToast, setSavedToast] = useState(false);

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);

  const [otherAnswers, setOtherAnswers] = useState([]);

  // =====================
  // login
  // =====================
  useEffect(() => {
    if (!userId) navigate("/login", { replace: true });
  }, [userId]);

  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      localStorage.clear();
      setUserId(null);
    }
  };

  // =====================
  // fetch themes
  // =====================
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/api/themes`)
      .then((r) => r.json())
      .then(setThemes);
  }, [userId]);

  // =====================
  // fetch answers
  // =====================
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE}/api/answers/my?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        data.forEach((a) => {
          const qid = a.questionId ?? a.question_id;
          map[String(qid)] = a;
        });
        setAnswerMap(map);
      });
  }, [userId]);

  // =====================
  // save answer
  // =====================
  const handleSave = async () => {
    if (!activeQuestion) return;

    const qid = activeQuestion.questionId ?? activeQuestion.question_id;
    const content = textareaRef.current?.value || "";

    const res = await fetch(
      `${API_BASE}/api/answers/upsert?userId=${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: qid,
          answerContent: content,
        }),
      }
    );

    const result = await res.json();

    setAnswerMap((prev) => ({
      ...prev,
      [String(qid)]: result,
    }));

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1500);
  };

  // =====================
  // other answers
  // =====================
  useEffect(() => {
    if (!activeQuestion) return;

    const qid = activeQuestion.questionId ?? activeQuestion.question_id;

    fetch(`${API_BASE}/api/questions/${qid}/answers`)
      .then((r) => r.json())
      .then((data) => {
        setOtherAnswers(data.filter((a) => a.userId !== userId));
      });
  }, [activeQuestion]);

  const toggleTheme = (id) => {
    setOpenThemes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const highlight = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const getProgress = (theme) => {
    const qs = theme.questions || [];
    const done = qs.filter(
      (q) => answerMap[String(q.questionId ?? q.question_id)]
    ).length;

    return { done, total: qs.length };
  };

  if (!userId) return null;

  return (
    <div style={styles.wrapper}>

      {/* ================= LEFT ================= */}
      <div style={styles.sidebar}>

        <div style={styles.topBar}>
          <input
            style={styles.search}
            placeholder="検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button onClick={handleLogout} style={styles.logout}>
            ログアウト
          </button>
        </div>

        <div style={styles.filterRow}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              style={{
                ...styles.filterBtn,
                background:
                  statusFilter === f.key ? "#2563eb" : "#f3f4f6",
                color: statusFilter === f.key ? "#fff" : "#111",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {themes.map((theme) => {
          const id = theme.pdfId;
          const isOpen = openThemes.has(id);
          const { done, total } = getProgress(theme);

          return (
            <div key={id} style={styles.themeCard}>

              <div
                onClick={() => toggleTheme(id)}
                style={{
                  ...styles.themeHeader,
                  background: isOpen ? "#eef6ff" : "#fff",
                }}
              >
                <div>
                  📁 {theme.title}
                </div>

                <div style={styles.badge}>
                  {done}/{total}
                </div>

                <div style={styles.bar}>
                  <div
                    style={{
                      width: total ? `${(done / total) * 100}%` : "0%",
                      ...styles.barFill,
                    }}
                  />
                </div>
              </div>

              {isOpen &&
                theme.questions
                  ?.filter((q) => {
                    const qid = q.questionId ?? q.question_id;
                    const done = !!answerMap[String(qid)];

                    if (statusFilter === "completed") return done;
                    if (statusFilter === "uncompleted") return !done;
                    return true;
                  })
                  .map((q) => {
                    const qid = q.questionId ?? q.question_id;
                    const isActive =
                      activeQuestion &&
                      (activeQuestion.questionId ??
                        activeQuestion.question_id) === qid;

                    const done = !!answerMap[String(qid)];

                    return (
                      <div
                        key={qid}
                        onClick={() => setActiveQuestion(q)}
                        style={{
                          ...styles.question,
                          background: isActive ? "#e0f2fe" : "",
                          borderLeft: isActive
                            ? "4px solid #2563eb"
                            : "4px solid transparent",
                        }}
                      >
                        <span>{highlight(q.questionText)}</span>

                        <span
                          style={{
                            color: done ? "#22c55e" : "#aaa",
                          }}
                        >
                          {done ? "✔" : ""}
                        </span>
                      </div>
                    );
                  })}
            </div>
          );
        })}
      </div>

      {/* ================= RIGHT ================= */}
      <div style={styles.main}>
        {!activeQuestion ? (
          <div>問題を選択</div>
        ) : (
          <div style={styles.card}>

            <h3>{activeQuestion.questionText}</h3>

            <textarea
              ref={textareaRef}
              style={styles.textarea}
              defaultValue={
                answerMap[
                  String(
                    activeQuestion.questionId ??
                      activeQuestion.question_id
                  )
                ]?.answerContent || ""
              }
            />

            <button onClick={handleSave} style={styles.saveBtn}>
              保存
            </button>

            {savedToast && (
              <div style={styles.toast}>保存完了 ✔</div>
            )}

            <div style={styles.section}>
              <b onClick={() => setIsModelOpen(!isModelOpen)}>
                模範解答 {isModelOpen ? "▲" : "▼"}
              </b>
              {isModelOpen && (
                <div style={styles.box}>
                  {activeQuestion.correctAnswer}
                </div>
              )}
            </div>

            <div style={styles.section}>
              <b onClick={() => setIsAnswersOpen(!isAnswersOpen)}>
                他の人の回答 {isAnswersOpen ? "▲" : "▼"}
              </b>

              {isAnswersOpen &&
                otherAnswers.map((a) => (
                  <div key={a.answerId} style={styles.box}>
                    {a.userName}: {a.answerContent}
                  </div>
                ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// =====================
// styles
// =====================
const styles = {
  wrapper: { display: "flex", height: "100vh", fontFamily: "sans-serif" },

  sidebar: {
    width: 340,
    borderRight: "1px solid #ddd",
    padding: 10,
  },

  topBar: { display: "flex", gap: 8, marginBottom: 10 },

  search: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
  },

  logout: {
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ddd",
    background: "#fff",
  },

  filterRow: { display: "flex", gap: 6, marginBottom: 10 },

  filterBtn: {
    padding: "5px 10px",
    borderRadius: 8,
    border: "1px solid #ddd",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: "bold",
  },

  themeCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid #eee",
  },

  themeHeader: {
    padding: 10,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  badge: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },

  bar: {
    height: 4,
    background: "#eee",
    borderRadius: 10,
    marginTop: 6,
  },

  barFill: {
    height: 4,
    background: "#4ade80",
  },

  question: {
    padding: "6px 10px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    cursor: "pointer",
  },

  main: { flex: 1, padding: 20 },

  card: {
    border: "1px solid #ddd",
    padding: 20,
    borderRadius: 10,
  },

  textarea: {
    width: "100%",
    height: 120,
    marginTop: 10,
  },

  saveBtn: {
    marginTop: 10,
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#f8fafc",
    fontWeight: "bold",
  },

  toast: {
    marginTop: 10,
    padding: 8,
    background: "#22c55e",
    color: "white",
    borderRadius: 6,
    width: "fit-content",
  },

  section: { marginTop: 15 },

  box: {
    background: "#f3f4f6",
    padding: 10,
    marginTop: 8,
    borderRadius: 6,
  },
};