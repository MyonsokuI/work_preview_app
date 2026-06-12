import React from "react";
import GeneralReview from "../general_review";

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
  otherAnswers,
  answerMap,
  getQid,
  styles,
}) {
  // 現在選択されている質問のIDを安全に取得
  const currentQuestionId = getQid();
  
  // 現在の質問に紐づく回答のIDを取得（無い場合はnull）
  const currentAnswerId = answerMap[String(currentQuestionId)]?.answerId ?? null;

  return (
    <div style={styles.main || {}}>
      {!activeQuestion ? (
        <div>問題を選択してください</div>
      ) : (
        <div style={styles.card || {}}>
          <h3>{activeQuestion.questionText ?? "無題の質問"}</h3>

          <textarea
            ref={textareaRef}
            value={draftAnswer}
            onChange={(e) => setDraftAnswer(e.target.value)}
            style={styles.textarea || {}}
          />

          <button onClick={handleSave} style={styles.save || {}}>
            保存 {saved && "✔"}
          </button>

          {/* 模範解答アコーディオン */}
          <div style={{ marginTop: 15 }}>
            <b onClick={() => setIsModelOpen((v) => !v)} style={{ cursor: "pointer" }}>
              模範解答 {isModelOpen ? "▲" : "▼"}
            </b>
            {isModelOpen && (
              <div style={styles.box || {}}>
                {activeQuestion.correctAnswer ?? "模範解答は登録されていません。"}
              </div>
            )}
          </div>

          {/* 他の人の回答アコーディオン */}
          <div style={{ marginTop: 15 }}>
            <b onClick={() => setIsAnswersOpen((v) => !v)} style={{ cursor: "pointer" }}>
              他の人の回答 {isAnswersOpen ? "▲" : "▼"}
            </b>
            {isAnswersOpen &&
              (otherAnswers.length === 0 ? (
                <div style={styles.box || {}}>他人の回答はまだありません。</div>
              ) : (
                otherAnswers.map((a) => (
                  <div key={a.answerId} style={styles.box || {}}>
                    <strong>{a.userName ?? "匿名"}</strong>: {a.answerContent}
                  </div>
                ))
              ))}
          </div>

          {/* AI総合レビュー：ここを一番確実に連動する形に修正 */}
          <div style={{ marginTop: 40 }}>
            <GeneralReview
              key={currentQuestionId} // 👈 質問が変わったらコンポーネントを強制リフレッシュする魔法の引数
              questionId={currentQuestionId} // 👈 質問IDを渡す
              answerId={currentAnswerId}     // 👈 回答IDも一緒に安全に渡す
            />
          </div>
        </div>
      )}
    </div>
  );
}