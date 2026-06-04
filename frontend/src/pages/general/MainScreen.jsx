import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

export default function MainScreen() {
  const [themes, setThemes] = useState([]);
  const [activeThemeId, setActiveThemeId] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const [answerInput, setAnswerInput] = useState("");
  const [search, setSearch] = useState("");

  // =========================
  // API（Adminと完全統一）
  // =========================
  useEffect(() => {
    fetch(`${API_BASE}/api/themes`)
      .then((res) => res.json())
      .then((data) => {
        console.log("THEMES:", data);
        setThemes(data);

        if (data.length > 0) {
          setActiveThemeId(data[0].pdfId);

          if (data[0].questions?.length > 0) {
            setActiveQuestion(data[0].questions[0]);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // =========================
  // 現在のテーマ
  // =========================
  const currentTheme =
    themes.find((t) => t.pdfId === activeThemeId) || themes[0];

  // =========================
  // 検索フィルタ（テーマ単位）
  // =========================
  const filteredThemes = themes
    .map((theme) => {
      if (!search) return theme;

      const matchTheme = theme.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const filteredQuestions = theme.questions?.filter((q) =>
        q.questionText?.toLowerCase().includes(search.toLowerCase())
      );

      if (!matchTheme && (!filteredQuestions || filteredQuestions.length === 0)) {
        return null;
      }

      return {
        ...theme,
        questions: matchTheme ? theme.questions : filteredQuestions,
      };
    })
    .filter(Boolean);

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="検索"
          style={styles.search}
        />

        {filteredThemes.map((theme) => {
          const isActive = theme.pdfId === activeThemeId;

          return (
            <div key={theme.pdfId}>
              {/* フォルダ */}
              <div
                onClick={() => {
                  setActiveThemeId(theme.pdfId);
                  setActiveQuestion(theme.questions?.[0] || null);
                }}
                style={{
                  ...styles.theme,
                  background: isActive ? "#e5f0ff" : "transparent",
                }}
              >
                📁 {theme.title}
              </div>

              {/* 問題一覧 */}
              {isActive &&
                theme.questions?.map((q) => (
                  <div
                    key={q.questionId}
                    onClick={() => setActiveQuestion(q)}
                    style={{
                      ...styles.question,
                      background:
                        activeQuestion?.questionId === q.questionId
                          ? "#dbeafe"
                          : "transparent",
                    }}
                  >
                    {q.questionText}
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {!activeQuestion ? (
          <div>問題を選択してください</div>
        ) : (
          <div style={styles.card}>
            <h3>{activeQuestion.questionText}</h3>

            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              style={styles.textarea}
              placeholder="回答を入力"
            />

            <button style={styles.button}>保存（仮）</button>

            <hr />

            <div>
              <b>模範解答</b>
              <div style={styles.box}>
                {activeQuestion.correctAnswer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================
const styles = {
  wrapper: { display: "flex", height: "100vh", fontFamily: "sans-serif" },

  sidebar: {
    width: 320,
    borderRight: "1px solid #ddd",
    padding: 10,
    overflowY: "auto",
  },

  search: {
    width: "100%",
    padding: 8,
    marginBottom: 10,
  },

  theme: {
    padding: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: 4,
  },

  question: {
    padding: "6px 16px",
    fontSize: 13,
    cursor: "pointer",
    borderRadius: 4,
  },

  main: {
    flex: 1,
    padding: 20,
  },

  card: {
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 8,
  },

  textarea: {
    width: "100%",
    height: 120,
    marginTop: 10,
  },

  button: {
    marginTop: 10,
    padding: "6px 12px",
  },

  box: {
    background: "#f3f4f6",
    padding: 10,
    marginTop: 8,
  },
};