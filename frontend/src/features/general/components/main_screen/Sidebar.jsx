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
  const filteredThemes = props?.filteredThemes ?? [];
  const openThemes = props?.openThemes ?? new Set();
  const setOpenThemes = props?.setOpenThemes ?? (() => {});
  const answerMap = props?.answerMap ?? {};
  const handleSelectQuestion = props?.handleSelectQuestion ?? (() => {});
  const getProgress = props?.getProgress ?? (() => ({ done: 0, total: 0 }));
  const getProgressColor = props?.getProgressColor ?? (() => "#ddd");
  const styles = props?.styles ?? {};

  // サイドバー開閉の状態
  const isSidebarOpen = props?.isSidebarOpen ?? true;
  const setIsSidebarOpen = props?.setIsSidebarOpen ?? (() => {});

  // 鉄則の幅制御スタイル（絶対崩さない）
  const dynamicSidebarStyle = {
    ...(styles.sidebar || {}),
    width: isSidebarOpen ? "340px" : "0px",
    overflow: "hidden",
    transition: "width 0.25s ease-in-out", // 少しキビキビ動くように調整
    flexShrink: 0,
    position: "relative", // 内部の三本線ボタンの基準点にする
  };

  return (
    <div style={dynamicSidebarStyle}>
      {/* 💡 【変更】サイドバー内部の右上につける「閉じる」三本線ボタン */}
      <button 
        onClick={() => setIsSidebarOpen(false)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 5,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          color: "#6b7280", // 馴染むグレー
          padding: "4px 8px",
        }}
        title="サイドバーを閉じる"
      >
        ☰
      </button>

      {/* 検索 & ログアウト（※三本線と被らないように、元のtopBarのスタイルに少し右マージンがあると綺麗です） */}
      <div style={{ ...(styles.topBar || {}), paddingRight: "40px" }}>
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

      {/* テーマリスト */}
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