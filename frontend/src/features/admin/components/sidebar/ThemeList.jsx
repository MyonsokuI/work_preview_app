import ThemeItem from "./ThemeItem";
import { useState } from "react";

export default function ThemeList({
    themes,
    activeQuestionId,
    activeTab,
    onSelect,
    onThemeSelect,
    onAddQuestion,
    onDeleteQuestion,
    onThemeEdit
}) {
    const [openThemeId, setOpenThemeId] = useState(null);

    const handleToggle = (id) => {
        setOpenThemeId(prev => prev === id ? null : id);
    };
    return (
        <div style={{ flex: 1 }}>
            {themes.map((theme) => (
                <ThemeItem
                    key={theme.pdfId}
                    theme={theme}
                    isOpen={openThemeId === theme.pdfId}
                    onToggle={handleToggle}
                    activeQuestionId={activeQuestionId}
                    activeTab={activeTab}
                    onSelect={onSelect}
                    onThemeSelect={onThemeSelect}
                    onAddQuestion={onAddQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                    onThemeEdit={onThemeEdit}
                />
            ))}
        </div>
    );
}