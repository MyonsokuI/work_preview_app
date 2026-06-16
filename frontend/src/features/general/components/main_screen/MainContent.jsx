import React from "react";
import GeneralReview from "../general_review";
import general from "../../styles/General.module.css";

export default function MainContent({
  activeQuestion,
  textareaRef,
  draftAnswer,
  setDraftAnswer,
  handleSave,
  saved,
  isModelOpen,
  setIsModelOpen,
  isAnswersOpen,
  setIsAnswersOpen,
  isReviewOpen,
  setIsReviewOpen,
  otherAnswers,
  answerMap,
  getQid,
  styles,
}) {
  // ==============================
  // 文字折り返し用共通スタイル
  // ==============================
  const textWrapStyle = {
    maxWidth: "100%",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  return (
    <div
      style={{
        ...(styles.main || {}),
        maxWidth: "100%",
        overflowX: "hidden", // 🔥 横スクロール完全防止
        minWidth: 0,
      }}
    >
      {!activeQuestion ? (
        <div>問題を選択してください</div>
      ) : (
        <div className={general.card} style={{ maxWidth: "100%", minWidth: 0 }}>
          {/* ===================== 問題文 ===================== */}
          <h3 style={textWrapStyle}>
            {activeQuestion.questionText ?? "無題の質問"}
          </h3>

          {/* ===================== 回答入力 ===================== */}
          <textarea
            ref={textareaRef}
            value={draftAnswer}
            onChange={(e) => setDraftAnswer(e.target.value)}
            className={general.textarea}
            style={{
              maxWidth: "100%",
              minWidth: 0,
            }}
          />

          <button onClick={handleSave} className={general.primaryButton}>
            保存 {saved && "✔"}
          </button>

          {/* ===================== 模範解答 ===================== */}
          <div style={{ marginTop: 15, maxWidth: "100%" }}>
            <b
              onClick={() => setIsModelOpen((v) => !v)}
              style={{ cursor: "pointer" }}
            >
              {isModelOpen ? "▼" : "▶"} 模範解答
            </b>

            {isModelOpen && (
              <div className={general.box} style={textWrapStyle}>
                {activeQuestion.correctAnswer ??
                  "模範解答は登録されていません。"}
              </div>
            )}
          </div>

          {/* ===================== 他の人の回答 ===================== */}
          <div style={{ marginTop: 15, maxWidth: "100%" }}>
            <b
              onClick={() => setIsAnswersOpen((v) => !v)}
              style={{ cursor: "pointer" }}
            >
              {isAnswersOpen ? "▼" : "▶"} 他の人の回答
            </b>

            {isAnswersOpen &&
              (otherAnswers.length === 0 ? (
                <div className={general.box} style={textWrapStyle}>
                  他人の回答はまだありません。
                </div>
              ) : (
                otherAnswers.map((a) => (
                  <div
                    key={a.answerId}
                    className={general.box}
                    style={textWrapStyle}
                  >
                    <strong>{a.userName ?? "匿名"}</strong>:{" "}
                    {a.answerContent}
                  </div>
                ))
              ))}
          </div>

          {/* ===================== レビュー ===================== */}
          <div style={{ marginTop: 15, maxWidth: "100%" }}>
            <b
              onClick={() => setIsReviewOpen((v) => !v)}
              style={{ cursor: "pointer" }}
            >
              {isReviewOpen ? "▼" : "▶"} レビュー
            </b>

            {isReviewOpen && (
              <div style={{ maxWidth: "100%", minWidth: 0 }}>
                <GeneralReview
                  answerId={answerMap[String(getQid())]?.answerId}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}