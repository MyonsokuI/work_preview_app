import React from "react";
import ThemeItem from "./ThemeItem";

const FILTERS = [
  { key: "all", label: "すべて" },
  { key: "completed", label: "完了" },
  { key: "uncompleted", label: "未完了" },
];

export default function Sidebar(props) {
  const searchQuery = props?.searchQuery ?? "";
  const setSearchQuery = props?.setSearchQuery ?? (() => {});
  const setUserId = props?.setUserId ?? (() => {});
  const statusFilter = props?.statusFilter ?? "all";
  const setStatusFilter = props?.setStatusFilter ?? (() => {});
  const themes = props?.filteredThemes ?? []; // ← ここは「未フィルタ元 or フィルタ済み」どっちでもOK
  const openThemes = props?.openThemes ?? new Set();
  const setOpenThemes = props?.setOpenThemes ?? (() => {});
  const answerMap = props?.answerMap ?? {};
  const handleSelectQuestion = props?.handleSelectQuestion ?? (() => {});
  const getProgress = props?.getProgress ?? (() => ({ done: 0, total: 0 }));
  const getProgressColor = props?.getProgressColor ?? (() => "#ddd");
  const styles = props?.styles ?? {};

  // =========================
  // ⭐ 検索（フォルダ名＋問題文）
  // =========================
  const query = searchQuery.trim().toLowerCase();

  const filtered = (themes || []).filter((theme) => {
    if (!query) return true;

    // -------------------------
    // フォルダ名（複数キー対応）
    // -------------------------
    const folderName =
      (
        theme.title ??
        theme.themeTitle ??
        theme.pdfTitle ??
        theme.name ??
        ""
      ).toLowerCase();

    const matchFolder = folderName.includes(query);

    // -------------------------
    // 問題文
    // -------------------------
    const matchQuestion = (theme.questions || []).some((q) =>
      (q.questionText ?? "").toLowerCase().includes(query)
    );

    return matchFolder || matchQuestion;
  });

  return (
    <div style={styles.sidebar || {}}>
      {/* 検索 */}
      <div style={styles.topBar || {}}>
        <input
          style={styles.search || {}}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="フォルダ名・問題文で検索"
        />

        <button
          onClick={() => {
            localStorage.clear();
            setUserId(null);
          }}
          style={styles.logout || {}}
        >
          ログアウト
        </button>
      </div>

      {/* フィルター */}
      <div style={styles.filterRow || {}}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            style={{
              ...(styles.filterButton || {}),
              background: statusFilter === f.key ? "#2563eb" : "#f3f4f6",
              color: statusFilter === f.key ? "#fff" : "#111",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* リスト */}
      {filtered.map((theme) => (
        <ThemeItem
          key={theme.pdfId}
          theme={theme}
          openThemes={openThemes}
          setOpenThemes={setOpenThemes}
          answerMap={answerMap}
          handleSelectQuestion={handleSelectQuestion}
          getProgress={getProgress}
          getProgressColor={getProgressColor}
          styles={styles}
        />
      ))}
    </div>
  );
}