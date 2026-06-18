import React from "react";
import GeneralReview from "../general_review";
import general from "../../styles/General.module.css";

export default function MainContent({
  activeQuestion,
  textareaRef,
  answerFileInputRef,
  draftAnswer,
  setDraftAnswer,
  draftAnswerImagePath,
  handleAnswerImageUpload,
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

  const questionImageUrl = activeQuestion?.imagePath
    ? `http://localhost:8080${encodeURI(activeQuestion.imagePath)}`
    : "";

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

          {/* ===================== 問題画像 ===================== */}
          {questionImageUrl && (
            <div
              style={{
                marginTop: 12,
                marginBottom: 12,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={questionImageUrl}
                alt="問題画像"
                style={{
                  maxWidth: "100%",
                  maxHeight: 320,
                  objectFit: "contain",
                  borderRadius: 8,
                  display: "block",
                }}
              />
            </div>
          )}

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

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
              回答画像（任意）
            </label>
            <input
              ref={answerFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAnswerImageUpload}
            />
            {draftAnswerImagePath && (
              <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
                <img
                  src={`http://localhost:8080${encodeURI(draftAnswerImagePath)}`}
                  alt="回答画像"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 240,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </div>
            )}
          </div>

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
                    style={{ ...textWrapStyle, marginBottom: 12 }}
                  >
                    <strong>{a.userName ?? "匿名"}</strong>:{" "}
                    <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
                      {a.answerContent}
                    </div>
                    {a.imagePath && (
                      <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
                        <img
                          src={`http://localhost:8080${encodeURI(a.imagePath)}`}
                          alt="他の回答画像"
                          style={{
                            maxWidth: "100%",
                            maxHeight: 240,
                            objectFit: "contain",
                            borderRadius: 8,
                            display: "block"
                          }}
                        />
                      </div>
                    )}
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