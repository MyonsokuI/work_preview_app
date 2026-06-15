import React from "react";
import pdfImage from "../../../../assets/pdf.jpeg";
export default function ThemeItem(props) {
  // すべてのPropsを安全にフォールバック付きで展開
  const theme = props?.theme;
  const openThemes = props?.openThemes ?? new Set();
  const setOpenThemes = props?.setOpenThemes ?? (() => { });
  const answerMap = props?.answerMap ?? {};
  const handleSelectQuestion = props?.handleSelectQuestion ?? (() => { });
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

  // 💡 既存のレイアウトと絶対に干渉しない、プレーンなインライン省略スタイル
  const textEllipsisStyle = {
    display: "inline-block",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "140px", // 💡 サイドバー（最大340px）の中で進捗バーが消えない絶妙な幅に制限
  };

  return (
    <div>
      {/* アコーディオンヘッダー：【元通り】styleは一切弄りません */}
      <div
        onClick={() =>
          setOpenThemes((prev) => {
            const next = new Set(prev);
            next.has(themeId) ? next.delete(themeId) : next.add(themeId);
            return next;
          })
        }
        style={{ ...styles.theme, flexDirection: "column", alignItems: "stretch" }}
      >
        {/* 1段目：タイトルとアイコン */}
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          {isOpen ? "▼" : "▶"} {theme.title ?? "無題のテーマ"}

          {theme.fileUrl && (
            <a href={theme.fileUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", display: "flex" }}>
              <img src={pdfImage} alt="PDF" style={{ width: "28px", height: "25px" }} />
            </a>
          )}
        </div>
        {/* 2段目：進捗テキストとバー */}
        <div style={{ width: "100%", marginTop: "8px" }}>
          <div style={styles.progressText}>{done}/{total}</div>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressBar, width: `${ratio * 100}%`, backgroundColor: getProgressColor(ratio) }} />
          </div>
        </div>
      </div>

      {/* 開閉する質問リスト：【元通り】styleは一切弄りません */}
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
              📝{" "}
              {/* 💡 問題文もテキスト部分だけを安全に省略。問題文は長めなので幅を少し広めに確保 */}
              <span style={{ ...textEllipsisStyle, maxWidth: "220px" }} title={q.questionText}>
                {q.questionText ?? "無題の質問"}
              </span>
              {done && <span style={{ color: "#22c55e", marginLeft: 4 }}>✔</span>}
            </div>
          );
        })}
    </div>
  );
}