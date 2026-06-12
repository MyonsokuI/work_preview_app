import React from "react";

export default function ThemeItem(props) {
  // すべてのPropsを安全にフォールバック付きで展開
  const theme = props?.theme;
  const openThemes = props?.openThemes ?? new Set();
  const setOpenThemes = props?.setOpenThemes ?? (() => {});
  const answerMap = props?.answerMap ?? {};
  const handleSelectQuestion = props?.handleSelectQuestion ?? (() => {});
  const getProgress = props?.getProgress ?? (() => ({ done: 0, total: 0 }));
  const getProgressColor = props?.getProgressColor ?? (() => "#ddd");
  const styles = props?.styles ?? {};

  // theme自体が渡されていない場合は何もレンダリングしない（安全装置）
  if (!theme) return null;

  const themeId = theme.pdfId;
  const isOpen = openThemes.has(themeId);
  const { done, total } = getProgress(theme);
  const ratio = total ? done / total : 0;

  // theme.questions が undefined や null の場合に備えて安全に配列化する
  const questions = theme.questions ?? [];

  return (
    <div>
      {/* アコーディオンヘッダー */}
      <div
        onClick={() =>
          setOpenThemes((prev) => {
            const next = new Set(prev);
            next.has(themeId) ? next.delete(themeId) : next.add(themeId);
            return next;
          })
        }
        style={styles.theme || {}}
      >
        {isOpen ? "▼" : "▶"} 📁 {theme.title ?? "無題のテーマ"}

        <div style={styles.progressText || {}} >
          {done}/{total}
        </div>

        <div style={styles.progressBg || {}}>
          <div
            style={{
              ...(styles.progressBar || {}),
              width: `${ratio * 100}%`,
              backgroundColor: getProgressColor(ratio),
            }}
          />
        </div>
      </div>

      {/* 開閉する質問リスト（?.map にし、さらに空配列を保証しているので絶対に落ちない） */}
      {isOpen &&
        questions.map((q) => {
          if (!q) return null;
          const qid = q.questionId ?? q.question_id;
          const done = (answerMap[String(qid)]?.answerContent || "").trim().length > 0;

          return (
            <div
              key={qid}
              onClick={() => handleSelectQuestion(q)}
              style={styles.question || {}}
            >
              📝 {q.questionText ?? "無題の質問"}
              {done && <span style={{ color: "#22c55e", marginLeft: 4 }}>✔</span>}
            </div>
          );
        })}
    </div>
  );
}