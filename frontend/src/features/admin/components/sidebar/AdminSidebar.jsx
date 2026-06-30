import { useState } from "react";
import styles from '../../styles/AdminSidebar.module.css';
import LogoutSection from "./LogoutSection";
import SearchBox from "./SearchBox";
import ThemeCreateSection from "./ThemeCreateSection";
import ThemeList from "./ThemeList";

export default function AdminSidebar(props) {
    const [searchQuery, setSearchQuery] = useState("");

    // サイドバー全体のスタイル
    const sidebarStyle = {
        ...props.styles?.sidebar,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden", // コンテナからはみ出さないようにする
    };
    const filteredThemes = (props.themes || []).map((theme) => {
        // 1. まず、そのテーマ内の質問を検索ワードで絞り込む
        const filteredQuestions = (theme.questions || []).filter((q) => {
            if (!searchQuery.trim()) return true; // 検索ワードがなければ全表示
            return q.questionText?.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // 2. テーマ自体を表示するかどうかの判定
        // A: テーマタイトルにマッチしている
        // B: 絞り込んだ結果、質問が1つでも残っている
        const isThemeMatch = theme.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const hasMatchInQuestions = filteredQuestions.length > 0;

        return {
            ...theme,
            // ここで絞り込んだ質問だけをセットする
            questions: isThemeMatch ? (theme.questions || []) : filteredQuestions
        };
    }).filter((theme) => {
        // 最終的に、テーマ名にマッチするか、または質問が残っているテーマだけを残す
        const query = searchQuery.toLowerCase();
        const isThemeMatch = theme.title?.toLowerCase().includes(query);
        return isThemeMatch || theme.questions.length > 0;
    });

    const sortedThemes = [...filteredThemes].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    return (
        <div className={styles.sidebarContainer} style={sidebarStyle}>
            {/* ヘッダー領域：ここを固定する */}
            <div style={{ flexShrink: 0, padding: "10px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1 }}>
                        <LogoutSection onLogout={props.onLogout} />
                    </div>
                    <button
                        onClick={() => props.setIsSidebarOpen(false)}
                        style={{ cursor: "pointer", background: "none", border: "1px solid #ddd", borderRadius: "4px" }}
                    >
                        ☰
                    </button>
                </div>
                <SearchBox value={searchQuery} onChange={setSearchQuery} />
                <ThemeCreateSection onAddTheme={props.onAddTheme} />
            </div>

            {/* スクロール可能領域：ここだけがスクロールする */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                <ThemeList
                    {...props}
                    themes={sortedThemes}
                    onSelect={props.onSelectQuestion}
                    onThemeSelect={props.onThemeSelect}
                    onAddQuestion={props.onAddQuestion}
                    onDeleteQuestion={props.onDeleteQuestion}
                    onThemeEdit={props.onThemeEdit}
                />
            </div>
        </div>
    );
}