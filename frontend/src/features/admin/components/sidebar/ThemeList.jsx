import ThemeItem from "./ThemeItem";
import { useState } from "react";

export default function ThemeList({
    themes,
    activeQuestionId,
    activeTab,
    onSelect, // 追加
    onAddQuestion,
    onDeleteQuestion,
    onShowProgress
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
                    onSelect={onSelect} // ここを修正
                    onAddQuestion={onAddQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                    onShowProgress={onShowProgress}
                />
            ))}
        </div>
    );
}