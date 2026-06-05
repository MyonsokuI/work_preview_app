import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

export default function MainScreen() {
  const [themes, setThemes] = useState([]);
  const [activeThemeId, setActiveThemeId] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // 課題表示のフィルタ
  const [statusFilter, setStatusFilter] = useState("all");

  const [answerInput, setAnswerInput] = useState("");
  const [search, setSearch] = useState("");

  // 模範解答・他人回答の表示/非表示
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);

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
  // 他の人の回答一覧を保持
  // =========================
  const [answers, setAnswers] = useState([]);

  // 問題が選択されたら、その問題の回答一覧を取得
  useEffect(() => {
    // 問題未選択なら何もしない
    if (!activeQuestion) return;

    fetch(
      `http://localhost:8080/api/questions/${activeQuestion.questionId}/answers`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("回答取得に失敗しました");
        }
        return res.json();
      })
      .then((data) => {
        // 取得した回答一覧を保存

        setAnswers(data);
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(answers);

  }, [activeQuestion]);


  // ★問題切り替え検知
  useEffect(() => {
    setIsModelOpen(false);
    setIsAnswersOpen(false);
  }, [activeQuestion?.questionId]);

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

        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="radio"
              name="status"
              value="all"
              checked={statusFilter === "all"}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            すべて
          </label>

          <br />

          <label>
            <input
              type="radio"
              name="status"
              value="completed"
              checked={statusFilter === "completed"}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            完了
          </label>

          <br />

          <label>
            <input
              type="radio"
              name="status"
              value="uncompleted"
              checked={statusFilter === "uncompleted"}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            未完了
          </label>
        </div>

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

            {/* ==========================
                模範解答
            ========================== */}
            <div>
              <b style={{ cursor: "pointer" }} onClick={() => setIsModelOpen((prev) => !prev)}>
                模範解答{isModelOpen ? "▶" : "▼"}
              </b>

              {isModelOpen && (
                <div style={styles.box}>
                  {activeQuestion.correctAnswer}
                </div>
              )}
            </div>

            {/* ==========================
                他の人の回答一覧
            ========================== */}
            <div style={{ marginTop: "20px" }}>
              <b style={{ cursor: "pointer" }} onClick={() => setIsAnswersOpen((prev) => !prev)}>
                他の人の回答{isAnswersOpen ? "▶" : "▼"}
              </b>

              {isAnswersOpen && (
                /* 回答が0件の場合 */
                <div>
                  {
                    answers.length === 0 ? (
                      <div style={styles.box}>
                        回答はありません
                      </div>
                    ) : (
                      /* 回答一覧を表示 */
                      answers.map((answer) => (
                        <div
                          key={answer.answerId}
                          style={{
                            ...styles.box,
                            marginTop: "8px",
                          }}
                        >
                          {answer.userName}さんの回答: <br />
                          {answer.answerContent}
                        </div>
                      ))
                    )
                  }
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