import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

export default function MainScreen() {
  // 💡 Login.jsxが保存した「currentUser」オブジェクトから実際のユーザーIDを動的に取得
  const [userId, setUserId] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem("currentUser");
      if (savedUserStr) {
        const userObj = JSON.parse(savedUserStr);
        return userObj.userId ? Number(userObj.userId) : null;
      }
    } catch (e) {
      console.error("ユーザー情報のパースに失敗したにゃ:", e);
    }
    return null;
  });

  const [themes, setThemes] = useState([]);
  const [activeThemeId, setActiveThemeId] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // 課題表示のフィルタ
  const [statusFilter, setStatusFilter] = useState("all");

  const [answerInput, setAnswerInput] = useState("");
  const [search, setSearch] = useState("");
  // questionId -> answer
  const [answerMap, setAnswerMap] = useState({});
  const [saved, setSaved] = useState(false);

  // 模範解答・他人回答の表示/非表示
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);

  // =========================
  // テーマ取得
  // =========================
  useEffect(() => {
    fetch(`${API_BASE}/api/themes`)
      .then((res) => res.json())
      .then((data) => {
        setThemes(data);

        if (data.length > 0) {
          setActiveThemeId(data[0].pdfId);
          setActiveQuestion(data[0].questions?.[0] || null);
        }
      })
      .catch(console.error);
  }, []);

  // =========================
  // 回答取得
  // =========================
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE}/api/answers/my?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("answers raw:", data);

        const map = {};

        data.forEach((a) => {
          const questionId = a.questionId ?? a.question_id;
          const answerId = a.answerId ?? a.answer_id;
          const answerContent =
            a.answerContent ?? a.answer_content ?? "";

          const submittedAt =
            a.submittedAt ?? a.submitted_at ?? a.createdAt;

          if (!questionId) return;

          const key = String(questionId);
          const existing = map[key];
          const existingTime = existing?.submittedAt ? new Date(existing.submittedAt) : 0;
          const newTime = submittedAt ? new Date(submittedAt) : 0;

          if (!existing || newTime > existingTime) {
            map[key] = {
              ...a,
              questionId,
              answerId,
              answerContent,
              submittedAt,
            };
          }
        });

        setAnswerMap(map);
      })
      .catch(console.error);
  }, [userId]);

  // =========================
  // 現在テーマ
  // =========================
  const currentTheme =
    themes.find((t) => t.pdfId === activeThemeId) || themes[0];

  // =========================
  // 保存（★新規の組み合わせでも確実に文字を送るよう追記）
  // =========================
  const handleSave = async () => {
    if (!activeQuestion || !userId) {
      alert("ログイン情報が見つからないか、問題が選択されていません");
      return;
    }

    const questionId = activeQuestion.questionId ?? activeQuestion.question_id;
    const key = String(questionId);

    // 💡 追記：画面上のtextareaから直接最新の入力内容を引っこ抜く
    const textareaElem = document.querySelector("textarea");
    const content = textareaElem ? textareaElem.value : (answerMap[key]?.answerContent || "");

    try {
      const res = await fetch(`${API_BASE}/api/answers/upsert?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: questionId,
          answerContent: content, // 最新のテキストを確実に送信！
        }),
      });

      if (!res.ok) throw new Error("保存に失敗しました");

      const result = await res.json();
      console.log("SAVE RESULT:", result);

      const normalizedKey = String(result.questionId ?? questionId);
      const normalized = {
        ...result,
        questionId: result.questionId ?? questionId,
        answerId: result.answerId,
        answerContent: result.answerContent ?? content,
        submittedAt: result.submittedAt,
      };

      setAnswerMap((prev) => ({
        ...prev,
        [normalizedKey]: normalized,
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch (err) {
      console.error(err);
      alert("保存失敗");
    }
  };

  // =========================
  // 他の人の回答一覧を保持
  // =========================
  const [otherAnswers, setOtherAnswers] = useState([]);

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
        const filtered = data.filter(
          (a) => a.userId !== userId); // 自分の回答は除外

        setOtherAnswers(filtered);
      })
      .catch((err) => {
        console.error(err);
      });

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
      {/* ================= SIDEBAR ================= */}
      <div style={styles.sidebar}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="検索"
          style={styles.search}
        />

        <div style={{
          marginTop: "10px",
          display: "flex",
          gap: "12px",
        }}>
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

        {themes.map((theme) => {
          const isActive = theme.pdfId === activeThemeId;

          return (
            <div key={theme.pdfId}>
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

              {isActive &&
                theme.questions?.filter((q) => {
                  const qid = q.questionId ?? q.question_id;
                  // 完了のみ表示
                  if (statusFilter === "completed") {
                    return !!answerMap[qid];
                  }

                  // 未完了のみ表示
                  if (statusFilter === "uncompleted") {
                    return !answerMap[qid];
                  }

                  // すべて表示
                  return true;
                })

                  .map((q) => {
                    const qid = q.questionId ?? q.question_id;

                    return (
                      <div
                        key={qid}
                        onClick={() => setActiveQuestion(q)}
                        style={{
                          ...styles.question,
                          background:
                            (activeQuestion?.questionId ?? activeQuestion?.question_id) === qid
                              ? "#dbeafe"
                              : "transparent",
                          fontWeight: "normal",
                        }}
                      >
                        📝 {q.questionText}
                      </div>
                    );
                  })}
            </div>
          );
        })}
      </div>

      {/* ================= MAIN ================= */}
      <div style={styles.main}>
        {!activeQuestion ? (
          <div>問題を選択してください</div>
        ) : (
          <div style={styles.card}>
            <h3>{activeQuestion.questionText}</h3>

            {/* ================= ANSWER ================= */}
            <textarea
              value={
                (() => {
                  const qid =
                    activeQuestion.questionId ??
                    activeQuestion.question_id;

                  return (
                    answerMap[String(qid)]?.answerContent || ""
                  );
                })()
              }
              onChange={(e) => {
                const value = e.target.value;

                const qid =
                  activeQuestion.questionId ??
                  activeQuestion.question_id;

                setAnswerMap((prev) => ({
                  ...prev,
                  [String(qid)]: {
                    ...prev[String(qid)],
                    answerContent: value,
                    questionId: qid,
                  },
                }));
              }}
              style={styles.textarea}
              placeholder="回答を入力"
            />

            <div style={{ marginTop: 10 }}>
              <button onClick={handleSave} style={styles.button}>
                保存
              </button>

              {saved && (
                <span style={{ color: "green", marginLeft: 10 }}>
                  保存しました
                </span>
              )}
            </div>

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
                    otherAnswers.length === 0 ? (
                      <div style={styles.box}>
                        回答はありません
                      </div>
                    ) : (
                      /* 回答一覧を表示 */
                      otherAnswers
                        .map((answer) => (
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
  wrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  sidebar: {
    width: 320,
    borderRight: "1px solid #ddd",
    overflowY: "auto",
    padding: 10,
  },
  theme: {
    padding: 8,
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: 4,
  },
  question: {
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: 13,
    borderRadius: 4,
  },
  main: {
    flex: 1,
    padding: 20,
  },
  card: {
    border: "1px solid #ddd",
    padding: 20,
    borderRadius: 8,
  },
  textarea: {
    width: "100%",
    height: 120,
    marginTop: 10,
  },
  button: {
    padding: "6px 12px",
  },
  box: {
    background: "#f3f4f6",
    padding: 10,
    marginTop: 8,
    borderRadius: 6,
  },
};