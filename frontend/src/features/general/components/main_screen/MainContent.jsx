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
  return (
    <div style={styles.main || {}}>
      {!activeQuestion ? (
        <div>問題を選択してください</div>
      ) : (
        <div className={general.card}>
          <h3>{activeQuestion.questionText ?? "無題の質問"}</h3>

          <textarea
            ref={textareaRef}
            value={draftAnswer}
            onChange={(e) => setDraftAnswer(e.target.value)}
            className={general.textarea}
          />

          <button onClick={handleSave} className={general.primaryButton}>
            保存 {saved && "✔"}
          </button>

          {/* 模範解答 */}
          <div style={{ marginTop: 15 }}>
            <b
              onClick={() => setIsModelOpen(v => !v)}
              style={{ cursor: "pointer" }}
            >
              {isModelOpen ? "▼" : "▶"} 模範解答
            </b>

            {isModelOpen && (
              <div className={general.box}>
                {activeQuestion.correctAnswer ?? "模範解答は登録されていません。"}
              </div>
            )}
          </div>

          {/* 他の人の回答 */}
          <div style={{ marginTop: 15 }}>
            <b
              onClick={() => setIsAnswersOpen(v => !v)}
              style={{ cursor: "pointer" }}
            >
              {isAnswersOpen ? "▼" : "▶"} 他の人の回答
            </b>

            {isAnswersOpen &&
              (otherAnswers.length === 0 ? (
                <div style={styles.box || {}}>
                  他人の回答はまだありません。
                </div>
              ) : (
                otherAnswers.map((a) => (
                  <div key={a.answerId} style={styles.box || {}}>
                    <strong>{a.userName ?? "匿名"}</strong>: {a.answerContent}
                  </div>
                ))
              ))}
          </div>

          {/* レビュー */}
          <div style={{ marginTop: 15 }}>
            <b
              onClick={() => setIsReviewOpen(v => !v)}
              style={{ cursor: "pointer" }}
            >
              {isReviewOpen ? "▼" : "▶"} レビュー
            </b>

            {isReviewOpen && (
              <GeneralReview
                answerId={answerMap[String(getQid())]?.answerId}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}