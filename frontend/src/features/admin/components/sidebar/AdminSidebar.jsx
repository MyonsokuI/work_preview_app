import { useState } from "react";
import styles from '../../styles/AdminSidebar.module.css';
import LogoutSection from "./LogoutSection";
import SearchBox from "./SearchBox";
import ThemeCreateSection from "./ThemeCreateSection";
import ThemeList from "./ThemeList";

export default function AdminSidebar(props) {
    const [searchQuery, setSearchQuery] = useState("");

    // AdminSidebar.jsx 内
    const sidebarStyle = props.styles?.sidebar || {};

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

    return (
        <div className={styles.sidebarContainer} style={sidebarStyle}>
            <div className={styles.scrollArea}>
                {/* ログアウトと閉じるボタンを横並びにするラッパー */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px" }}>
                    <div style={{ flex: 1 }}>
                        <LogoutSection onLogout={props.onLogout} />
                    </div>
                    <button
                        onClick={() => props.setIsSidebarOpen(false)}
                        style={{ cursor: "pointer", padding: "4px 8px" }}
                        title="サイドバーをたたむ"
                    >
                        ☰
                    </button>
                </div>
                <SearchBox value={searchQuery} onChange={setSearchQuery} />
                <ThemeCreateSection onAddTheme={props.onAddTheme} />
                <ThemeList {...props} themes={filteredThemes} onSelect={props.onSelectQuestion}
                    onAddQuestion={props.onAddQuestion}
                    onDeleteQuestion={props.onDeleteQuestion}
                    onThemeEdit={props.onThemeEdit} />
            </div>
        </div>
    );
}