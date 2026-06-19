import React from "react";
import ThemeItem from "./ThemeItem";

const FILTERS = [
  { key: "all", label: "すべて" },
  { key: "completed", label: "完了" },
  { key: "uncompleted", label: "未完了" },
];

export default function Sidebar(props) {
  const searchQuery = props?.searchQuery ?? "";
  const setSearchQuery = props?.setSearchQuery ?? (() => { });
  const setUserId = props?.setUserId ?? (() => { });
  const statusFilter = props?.statusFilter ?? "all";
  const setStatusFilter = props?.setStatusFilter ?? (() => { });
  const themes = props?.filteredThemes ?? [];

  const openThemes = props?.openThemes ?? new Set();
  const setOpenThemes = props?.setOpenThemes ?? (() => { });

  const answerMap = props?.answerMap ?? {};
  const handleSelectQuestion = props?.handleSelectQuestion ?? (() => { });
  const getProgress = props?.getProgress ?? (() => ({ done: 0, total: 0 }));
  const getProgressColor = props?.getProgressColor ?? (() => "#ddd");

  const styles = props?.styles ?? {};

  // 親から管理されている開閉ステート
  const isSidebarOpen = props?.isSidebarOpen ?? true;

  const query = searchQuery.trim().toLowerCase();

  const filtered = (themes || []).filter((theme) => {
    if (!query) return true;

    const folderName = (
      theme.title ??
      theme.themeTitle ??
      theme.pdfTitle ??
      theme.name ??
      ""
    ).toLowerCase();

    const matchFolder = folderName.includes(query);

    const matchQuestion = (theme.questions || []).some((q) =>
      (q.questionText ?? "").toLowerCase().includes(query)
    );

    return matchFolder || matchQuestion;
  });

  return (
    <aside
      style={{
        ...styles.sidebar,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* isSidebarOpen が true の時だけ中身を出す。
        これにより、width: 0 になった際のコンテンツの「はみ出し」を完全に遮断します。
      */}
      {isSidebarOpen && (
        <>
          {/* =========================
              TOP BAR
             ========================= */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 40px 10px 6px",
            }}
          >
            {/* 検索窓 */}
            <input
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                background: "#f8fafc",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索"
            />

            {/* ログアウト */}
            <button
              onClick={() => {
                localStorage.clear();
                setUserId(null);
              }}
              style={{
                padding: "10px 12px",
                border: "1px solid #dbe3ee",
                background: "#fff",
                borderRadius: 10,
                cursor: "pointer",
                color: "#334155",
                fontWeight: 600,
              }}
            >
              ログアウト
            </button>
          </div>

          {/* =========================
              FILTER
             ========================= */}
          <div style={{ display: "flex", gap: 6, padding: "0 6px 8px" }}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: statusFilter === f.key ? "1px solid #2563eb" : "1px solid #dbe3ee",
                  background: statusFilter === f.key ? "#2563eb" : "#f8fafc",
                  color: statusFilter === f.key ? "#fff" : "#334155",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* =========================
              LIST
             ========================= */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map((theme) => (
              <ThemeItem
                key={String(theme.pdfId)}
                theme={theme}
                openThemes={openThemes}
                setOpenThemes={setOpenThemes}
                answerMap={answerMap}
                handleSelectQuestion={handleSelectQuestion}
                getProgress={getProgress}
                getProgressColor={getProgressColor}
                styles={styles}
                isCollapsed={false}
              />
            ))}
          </div>
        </>
      )}
    </aside>
  );
}