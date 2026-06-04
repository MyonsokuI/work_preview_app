import React, { useEffect, useState, useMemo } from "react";

const API_BASE = "http://localhost:8080";

export default function MainScreen() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [search, setSearch] = useState("");
  const [openThemeId, setOpenThemeId] = useState(null);

  const [answerInput, setAnswerInput] = useState("");
  const [saved, setSaved] = useState(false);

  // ⭐ 折り畳み追加（重要）
  const [openModelAnswer, setOpenModelAnswer] = useState(true);
  const [openOtherAnswers, setOpenOtherAnswers] = useState(true);

  // =========================
  // API取得
  // =========================
  useEffect(() => {
    fetch(`${API_BASE}/api/questions`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  // =========================
  // グルーピング
  // =========================
  const themes = useMemo(() => {
    const map = {};

    questions.forEach((q) => {
      const themeId = q.pdf?.pdfId;
      const themeName = q.pdf?.title || "未分類";

      if (!map[themeId]) {
        map[themeId] = {
          themeId,
          themeName,
          questions: [],
        };
      }

      map[themeId].questions.push(q);
    });

    return Object.values(map);
  }, [questions]);

  // =========================
  // 検索
  // =========================
  const filteredThemes = useMemo(() => {
    const keyword = search.toLowerCase();

    if (!keyword) return themes;

    return themes
      .map((t) => {
        const themeMatch = t.themeName.toLowerCase().includes(keyword);

        const matchedQuestions = t.questions.filter((q) =>
          q.questionText.toLowerCase().includes(keyword)
        );

        if (!themeMatch && matchedQuestions.length === 0) {
          return null;
        }

        return {
          ...t,
          questions: themeMatch ? t.questions : matchedQuestions,
        };
      })
      .filter(Boolean);
  }, [themes, search]);

  // =========================
  // 保存（仮）
  // =========================
  const handleSave = () => {
    console.log({
      questionId: selectedQuestion.questionId,
      answer: answerInput,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.wrapper}>
      {/* ================= SIDEBAR ================= */}
      <div style={styles.sidebar}>
        <div style={styles.searchBox}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="検索"
            style={styles.search}
          />
        </div>

        <div style={styles.tree}>
          {filteredThemes.map((theme) => {
            const isOpen = openThemeId === theme.themeId;

            return (
              <div key={theme.themeId}>
                <div
                  onClick={() =>
                    setOpenThemeId(isOpen ? null : theme.themeId)
                  }
                  style={styles.themeItem}
                >
                  <span style={{ marginRight: 6 }}>
                    {isOpen ? "▼" : "▶"}
                  </span>
                  📁 {theme.themeName}
                </div>

                {isOpen && (
                  <div>
                    {theme.questions.map((q) => (
                      <div
                        key={q.questionId}
                        onClick={() => {
                          setSelectedQuestion(q);
                          setAnswerInput("");
                          setSaved(false);
                        }}
                        style={{
                          ...styles.questionItem,
                          background:
                            selectedQuestion?.questionId === q.questionId
                              ? "#dbeafe"
                              : "transparent",
                        }}
                      >
                        {q.questionText}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div style={styles.main}>
        {!selectedQuestion ? (
          <div style={styles.empty}>問題を選択してください</div>
        ) : (
          <div style={styles.card}>
            {/* QUESTION */}
            <h3>{selectedQuestion.questionText}</h3>

            {/* ANSWER INPUT */}
            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              style={styles.textarea}
              placeholder="回答を入力"
            />

            <div style={styles.row}>
              <button onClick={handleSave} style={styles.button}>
                保存
              </button>

              {saved && <span style={{ color: "green" }}>保存しました</span>}
            </div>

            {/* ================= 模範解答（折り畳み） ================= */}
            <div style={styles.section}>
              <div
                style={styles.foldHeader}
                onClick={() => setOpenModelAnswer(!openModelAnswer)}
              >
                <span>{openModelAnswer ? "▼" : "▶"}</span>
                <span style={{ marginLeft: 6 }}>模範解答</span>
              </div>

              {openModelAnswer && (
                <div style={styles.box}>
                  {selectedQuestion.correctAnswer}
                </div>
              )}
            </div>

            {/* ================= 他ユーザー回答（折り畳み） ================= */}
            <div style={styles.section}>
              <div
                style={styles.foldHeader}
                onClick={() =>
                  setOpenOtherAnswers(!openOtherAnswers)
                }
              >
                <span>{openOtherAnswers ? "▼" : "▶"}</span>
                <span style={{ marginLeft: 6 }}>
                  他のユーザーの回答
                </span>
              </div>

              {openOtherAnswers && (
                <div style={styles.boxMuted}>
                  まだ他のユーザーの回答はありません
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================
// STYLE
// =========================
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif",
  },

  sidebar: {
    width: 320,
    borderRight: "1px solid #ddd",
    overflowY: "auto",
  },

  searchBox: {
    padding: 10,
    borderBottom: "1px solid #eee",
  },

  search: {
    width: "100%",
    padding: 8,
    border: "1px solid #ddd",
  },

  tree: {
    padding: 10,
  },

  themeItem: {
    padding: "8px 6px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  questionItem: {
    padding: "6px 18px",
    cursor: "pointer",
    fontSize: 13,
    borderRadius: 4,
  },

  main: {
    flex: 1,
    padding: 20,
    background: "#f9fafb",
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  textarea: {
    width: "100%",
    height: 120,
    marginTop: 10,
  },

  row: {
    display: "flex",
    gap: 10,
    marginTop: 10,
    alignItems: "center",
  },

  button: {
    padding: "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  section: {
    marginTop: 20,
  },

  foldHeader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: 8,
  },

  box: {
    background: "#f3f4f6",
    padding: 10,
    borderRadius: 6,
  },

  boxMuted: {
    background: "#fafafa",
    padding: 10,
    borderRadius: 6,
    color: "#999",
  },

  empty: {
    color: "#888",
  },
};