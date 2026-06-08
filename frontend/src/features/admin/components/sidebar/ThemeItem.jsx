import styles from '../../styles/AdminSidebar.module.css';
import { useState } from "react";

export default function ThemeItem({ theme, isOpen, onToggle, onSelect, onAddQuestion }) {

    return (
        <div className={styles.themeItem}>
            <div className={styles.themeHeader} onClick={() => onToggle(theme.pdfId)}>
                <span style={{ fontWeight: '600' }}>{isOpen ? "▼" : "▶"} {theme.title}</span>
            </div>

            {isOpen && (
                <div className={styles.questionList}>
                    {theme.questions?.map(q => (
                        <div key={q.questionId} className={styles.questionItem} onClick={() => onSelect(theme.pdfId, q.questionId, "edit")}>
                            ❓ {q.questionText}
                        </div>
                    ))}
                    <button className={styles.addButton} onClick={() => onAddQuestion(theme.pdfId)}>
                        ＋ 問題を追加
                    </button>
                </div>
            )}
        </div>
    );
}