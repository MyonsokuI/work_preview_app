import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi"; // 💡 共通API関数をインポートしたにゃ！

export default function MainScreen() {
  const navigate = useNavigate();

  // textareaの文字を安全に取得するための参照(Ref)
  const textareaRef = useRef(null);

  // ユーザー情報を取得
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
  const [answerMap, setAnswerMap] = useState({});
  const [saved, setSaved] = useState(false);

  // 模範解答・他人回答の表示/非表示
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);

  // 検索キーワード用のState
  const [searchQuery, setSearchQuery] = useState("");

  // 他の人の回答一覧を保持
  const [otherAnswers, setOtherAnswers] = useState([]);

  // =========================
  // 🛡️ ログインチェックガード
  // =========================
  useEffect(() => {
    if (!userId) {
      navigate("/login", { replace: true });
    }
  }, [userId, navigate]);

  // =========================
  // 🛠️ ログアウト処理
  // =========================
  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      localStorage.removeItem("currentUser");
      localStorage.clear();
      setUserId(null); // Guardを働かせて/loginへ強制移動
    }
  };

  // =========================
  // 📁 テーマ取得
  // =========================
  useEffect(() => {
    if (!userId) return;

    // 💡 共通API関数（getThemes）に置き換えにゃ！
    userApi.getThemes()
      .then((data) => {
        setThemes(data);

        if (data.length > 0) {
          setActiveThemeId(data[0].pdfId);
          setActiveQuestion(data[0].questions?.[0] || null);
        }
      })
      .catch((err) => console.error("テーマ取得エラーにゃ:", err));
  }, [userId]);

  // =========================
  // 📝 自分の回答取得
  // =========================
  useEffect(() => {
    if (!userId) return;

    // 💡 共通API関数（getMyAnswers）に置き換えにゃ！
    userApi.getMyAnswers(userId)
      .then((data) => {
        console.log("answers raw:", data);
        const map = {};

        data.forEach((a) => {
          const questionId = a.questionId ?? a.question_id;
          const answerId = a.answerId ?? a.answer_id;
          const answerContent = a.answerContent ?? a.answer_content ?? "";
          const submittedAt = a.submittedAt ?? a.submitted_at ?? a.createdAt;

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
      .catch((err) => console.error("回答取得エラーにゃ:", err));
  }, [userId]);

  // =========================
  // 💾 回答の保存(共通upsert)
  // =========================
  const handleSave = async () => {
    if (!activeQuestion || !userId) {
      alert("ログイン情報が見つからないか、問題が選択されていません");
      return;
    }

    const questionId = activeQuestion.questionId ?? activeQuestion.question_id;
    const key = String(questionId);
    const content = textareaRef.current ? textareaRef.current.value : (answerMap[key]?.answerContent || "");

    try {
      // 💡 共通API関数（upsertAnswer）に置き換えにゃ！
      const result = await userApi.upsertAnswer(userId, questionId, content);
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
      alert(err.message || "保存失敗にゃ");
    }
  };

  // =========================
  // 👥 他の人の回答一覧の取得
  // =========================
  useEffect(() => {
    if (!activeQuestion) return;

    const targetQuestionId = activeQuestion.questionId ?? activeQuestion.question_id;

    // 💡 共通API関数（getOtherAnswers）に置き換えにゃ！
    userApi.getOtherAnswers(targetQuestionId)
      .then((data) => {
        // 自分の回答は除外してセット
        const filtered = data.filter((a) => a.userId !== userId);
        setOtherAnswers(filtered);
      })
      .catch((err) => {
        console.error("他人の回答取得エラーにゃ:", err);
      });

  }, [activeQuestion, userId]);

  // ★問題切り替え時、アコーディオンを閉じる
  useEffect(() => {
    setIsModelOpen(false);
    setIsAnswersOpen(false);
  }, [activeQuestion?.questionId, activeQuestion?.question_id]);

  // 未ログイン時は画面描画を一瞬止めるガード
  if (!userId) {
    return <div style={{ padding: 20 }}>ログイン画面へ移動中...</div>;
  }

  return (
    <div style={styles.wrapper}>
      {/* ================= SIDEBAR ================= */}
      <div style={styles.sidebar}>
        <div style={styles.topBar}>
          <input
            type="text"
            placeholder="問題をキーワード検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={handleLogout} style={styles.logoutButton}>
            ログアウト
          </button>
        </div>

        <div style={{ marginTop: "10px", display: "flex", gap: "12px" }}>
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
          const filteredQuestions = theme.questions?.filter((q) => {
            if (!searchQuery) return true;
            return q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
          }) || [];

          if (searchQuery && filteredQuestions.length === 0) return null;
          const isActive = theme.pdfId === activeThemeId;

          return (
            <div key={theme.pdfId}>
              <div
                onClick={() => {
                  setActiveThemeId(theme.pdfId);
                  if (filteredQuestions.length > 0) {
                    setActiveQuestion(filteredQuestions[0]);
                  }
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
                  if (statusFilter === "completed") return !!answerMap[qid];
                  if (statusFilter === "uncompleted") return !answerMap[qid];
                  return true;
                })
                  .map((q) => {
                    const qid = q.questionId ?? q.question_id;
                    const currentActiveId = activeQuestion?.questionId ?? activeQuestion?.question_id;

                    return (
                      <div
                        key={qid}
                        onClick={() => setActiveQuestion(q)}
                        style={{
                          ...styles.question,
                          background: currentActiveId === qid ? "#dbeafe" : "transparent",
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

            <textarea
              ref={textareaRef}
              value={
                (() => {
                  const qid = activeQuestion.questionId ?? activeQuestion.question_id;
                  return answerMap[String(qid)]?.answerContent || "";
                })()
              }
              onChange={(e) => {
                const value = e.target.value;
                const qid = activeQuestion.questionId ?? activeQuestion.question_id;

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

            <div style={{ marginTop: 10, marginBottom: 20 }}>
              <button onClick={handleSave} style={styles.button}>
                保存
              </button>
              {saved && (
                <span style={{ color: "green", marginLeft: 10 }}>
                  保存しました
                </span>
              )}
            </div>

            {/* 模範解答エリア */}
            <div style={{ marginBottom: 15 }}>
              <b style={{ cursor: "pointer" }} onClick={() => setIsModelOpen((prev) => !prev)}>
                模範解答 {isModelOpen ? "▲" : "▼"}
              </b>
              {isModelOpen && (
                <div style={styles.box}>
                  {activeQuestion.correctAnswer}
                </div>
              )}
            </div>

            {/* 他の人の回答一覧 */}
            <div style={{ marginTop: "20px" }}>
              <b style={{ cursor: "pointer" }} onClick={() => setIsAnswersOpen((prev) => !prev)}>
                他の人の回答 {isAnswersOpen ? "▲" : "▼"}
              </b>
              {isAnswersOpen && (
                <div>
                  {otherAnswers.length === 0 ? (
                    <div style={styles.box}>
                      回答はありません
                    </div>
                  ) : (
                    otherAnswers.map((answer) => (
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
                  )}
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
  sidebar: { width: 320, borderRight: "1px solid #ddd", overflowY: "auto", padding: 10 },
  topBar: { display: "flex", gap: "8px", marginBottom: "15px", paddingBottom: "10px", borderBottom: "1px solid #eee" },
  searchInput: { flex: 1, padding: "6px 10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" },
  logoutButton: { padding: "6px 10px", borderRadius: "4px", border: "1px solid #dee2e6", background: "#f8f9fa", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
  theme: { padding: 8, fontWeight: "bold", cursor: "pointer", borderRadius: 4 },
  question: { padding: "6px 16px", cursor: "pointer", fontSize: 13, borderRadius: 4 },
  main: { flex: 1, padding: 20 },
  card: { border: "1px solid #ddd", padding: 20, borderRadius: 8 },
  textarea: { width: "100%", height: 120, marginTop: 10 },
  button: { padding: "6px 12px" },
  box: { background: "#f3f4f6", padding: 10, marginTop: 8, borderRadius: 6, fontSize: "14px" },
};