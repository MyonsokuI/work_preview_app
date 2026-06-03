import React, { useEffect, useState, useMemo } from "react";

const API_BASE = "http://localhost:8080";

export default function MainScreen() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [search, setSearch] = useState("");
  const [openThemeId, setOpenThemeId] = useState(null);

  const [answerInput, setAnswerInput] = useState("");
  const [saved, setSaved] = useState(false);

  // =========================
  // API取得（Spring Boot）
  // =========================
  useEffect(() => {
    fetch(`${API_BASE}/api/questions`) // ← 後でテーマAPIにしてもOK
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => console.error("API失敗:", err));
  }, []);

  // =========================
  // theme = pdf.title でグルーピング
  // =========================
  const themes = useMemo(() => {
    const map = {};

    questions.forEach((q) => {
      const themeName = q.pdf?.title || "未分類";
      const themeId = q.pdf?.pdfId;

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
  // 検索フィルタ
  // =========================
  const filteredThemes = themes.filter((t) =>
    t.themeName.toLowerCase().includes(search.toLowerCase())
  );

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
            placeholder="検索..."
            style={styles.search}
          />
        </div>

        <div style={styles.tree}>
          {filteredThemes.map((theme) => {
            const isOpen = openThemeId === theme.themeId;

            return (
              <div key={theme.themeId}>
                {/* THEME */}
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

                {/* QUESTIONS */}
                {isOpen &&
                  theme.questions.map((q) => (
                    <div
                      key={q.questionId}
                      onClick={() => {
                        setSelectedQuestion(q);
                        setAnswerInput("");
                      }}
                      style={{
                        ...styles.questionItem,
                        background:
                          selectedQuestion?.questionId === q.questionId
                            ? "#dbeafe"
                            : "transparent",
                      }}
                    >
                      {highlight(q.questionText, search)}
                    </div>
                  ))}
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
            <div style={styles.label}>問題</div>
            <h3>{selectedQuestion.questionText}</h3>

            {/* ANSWER INPUT */}
            <div style={styles.label}>あなたの回答</div>
            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              style={styles.textarea}
              placeholder="ここに回答を入力..."
            />

            <div style={styles.row}>
              <button
                onClick={() => setSaved(true)}
                style={styles.button}
              >
                保存
              </button>

              {saved && <span style={{ color: "green" }}>保存しました</span>}
            </div>

            {/* MODEL ANSWER */}
            <div style={styles.section}>
              <div style={styles.label}>模範解答</div>
              <div style={styles.box}>
                {selectedQuestion.correctAnswer}
              </div>
            </div>

            {/* OTHER ANSWERS (ダミーUI) */}
            <div style={styles.section}>
              <div style={styles.label}>他のユーザーの回答</div>
              <div style={styles.boxMuted}>
                まだ他のユーザーの回答はありません
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================
// ハイライト
// =========================
function highlight(text = "", keyword = "") {
  if (!keyword) return text;

  const parts = text.split(new RegExp(`(${keyword})`, "gi"));

  return parts.map((p, i) =>
    p.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} style={{ background: "yellow" }}>
        {p}
      </span>
    ) : (
      p
    )
  );
}

// =========================
// STYLE（画像寄せ）
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
    background: "#fff",
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
    borderRadius: 4,
  },

  tree: {
    padding: 10,
  },

  themeItem: {
    padding: "8px 6px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  questionItem: {
    padding: "6px 20px",
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

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginTop: 12,
  },

  textarea: {
    width: "100%",
    height: 120,
    marginTop: 6,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 6,
  },

  row: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },

  button: {
    padding: "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },

  section: {
    marginTop: 16,
  },

  box: {
    background: "#f3f4f6",
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
  },

  boxMuted: {
    background: "#fafafa",
    padding: 10,
    borderRadius: 6,
    color: "#999",
    marginTop: 6,
  },

  empty: {
    color: "#888",
  },
};