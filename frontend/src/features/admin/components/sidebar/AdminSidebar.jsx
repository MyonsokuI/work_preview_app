import { useState } from "react";
import styles from '../../styles/AdminSidebar.module.css';
import LogoutSection from "./LogoutSection";
import SearchBox from "./SearchBox";
import ThemeCreateSection from "./ThemeCreateSection";
import ThemeList from "./ThemeList";

export default function AdminSidebar(props) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredThemes = (props.themes || []).filter((theme) => {
        if (!theme?.title) return false;
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return theme.title.toLowerCase().includes(query) ||
            (theme.questions || []).some(q => q.questionText?.toLowerCase().includes(query));
    });

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.scrollArea}>
                <LogoutSection onLogout={props.onLogout} />
                <SearchBox value={searchQuery} onChange={setSearchQuery} />
                <ThemeCreateSection onAddTheme={props.onAddTheme} />
                <ThemeList {...props} themes={filteredThemes} onSelect={props.onSelectQuestion}
                    onAddQuestion={props.onAddQuestion}
                    onDeleteQuestion={props.onDeleteQuestion} />
            </div>
        </div>
    );
}