import React from "react";
import ThemeItem from "./ThemeItem";

const FILTERS = [
  { key: "all", label: "すべて" },
  { key: "completed", label: "完了" },
  { key: "uncompleted", label: "未完了" },
];

export default function Sidebar(props) {
  // すべてのPropsを安全にフォールバック付きで展開
  const searchQuery = props?.searchQuery ?? "";
  const setSearchQuery = props?.setSearchQuery ?? (() => {});
  const setUserId = props?.setUserId ?? (() => {});
  const statusFilter = props?.statusFilter ?? "all";
  const setStatusFilter = props?.setStatusFilter ?? (() => {});
  const filteredThemes = props?.filteredThemes ?? []; // 👈 ここで絶対に配列にする
  const openThemes = props?.openThemes ?? new Set();
  const setOpenThemes = props?.setOpenThemes ?? (() => {});
  const answerMap = props?.answerMap ?? {};
  const handleSelectQuestion = props?.handleSelectQuestion ?? (() => {});
  const getProgress = props?.getProgress ?? (() => ({ done: 0, total: 0 }));
  const getProgressColor = props?.getProgressColor ?? (() => "#ddd");
  const styles = props?.styles ?? {};

  return (
    <div style={styles.sidebar || {}}>
      {/* 検索 & ログアウト */}
      <div style={styles.topBar || {}}>
        <input
          style={styles.search || {}}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="検索"
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

      {/* フィルター行 */}
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

      {/* テーマリスト（必ず配列なので絶対にmapで落ちない） */}
      {filteredThemes.map((theme) => (
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