import React from "react";
import pdfImage from "../../../../assets/pdf.jpeg";

export default function ThemeItem(props) {
  const theme = props?.theme;
  const openThemes = props?.openThemes ?? new Set();
  const setOpenThemes = props?.setOpenThemes ?? (() => {});
  const answerMap = props?.answerMap ?? {};
  const handleSelectQuestion = props?.handleSelectQuestion ?? (() => {});
  const getProgress = props?.getProgress ?? (() => ({ done: 0, total: 0 }));
  const getProgressColor = props?.getProgressColor ?? (() => "#ddd");
  const styles = props?.styles ?? {};

  if (!theme) return null;

  const themeId = theme.pdfId;
  const isOpen = openThemes.has(themeId);

  const { done, total } = getProgress(theme);
  const ratio = total ? done / total : 0;

  const questions = theme.questions ?? [];

  // =============================
  // 共通ellipsisスタイル（安定版）
  // =============================
  const ellipsisStyle = {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      {/* =============================
          ヘッダー（テーマ）
      ============================= */}
      <div
        onClick={() =>
          setOpenThemes((prev) => {
            const next = new Set(prev);
            next.has(themeId) ? next.delete(themeId) : next.add(themeId);
            return next;
          })
        }
        style={{
          ...styles.theme,
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {/* 1行目：アイコン + タイトル + PDF */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
          }}
        >
          <span style={{ marginRight: 4 }}>
            {isOpen ? "▼" : "▶"}
          </span>

          {/* テーマタイトル（ellipsis） */}
          <span
            style={{
              ...ellipsisStyle,
              flex: 1,
            }}
            title={theme.title}
          >
            {theme.title ?? "無題のテーマ"}
          </span>

          {/* PDFアイコン */}
          {theme.fileUrl && (
            <a
              href={theme.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "auto", display: "flex" }}
            >
              <img
                src={pdfImage}
                alt="PDF"
                style={{ width: 28, height: 25 }}
              />
            </a>
          )}
        </div>

        {/* 2行目：進捗 */}
        <div style={{ width: "100%", marginTop: 8 }}>
          <div style={styles.progressText}>
            {done}/{total}
          </div>

          <div style={styles.progressBg}>
            <div
              style={{
                ...styles.progressBar,
                width: `${ratio * 100}%`,
                backgroundColor: getProgressColor(ratio),
              }}
            />
          </div>
        </div>
      </div>

      {/* =============================
          問題リスト
      ============================= */}
      {isOpen &&
        questions.map((q) => {
          if (!q) return null;

          const qid = q.questionId ?? q.question_id;
          const doneFlag =
            (answerMap[String(qid)]?.answerContent || "").trim().length > 0;

          return (
            <div
              key={qid}
              onClick={() => handleSelectQuestion(q)}
              style={styles.question || {}}
            >
              📝

              {/* 問題文（ellipsis） */}
              <span
                style={{
                  ...ellipsisStyle,
                  display: "inline-block",
                  maxWidth: "220px",
                  verticalAlign: "middle",
                }}
                title={q.questionText}
              >
                {q.questionText ?? "無題の質問"}
              </span>

              {doneFlag && (
                <span style={{ color: "#22c55e", marginLeft: 4 }}>
                  ✔
                </span>
              )}
            </div>
          );
        })}
    </div>
  );
}