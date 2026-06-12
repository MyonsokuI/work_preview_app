import styles from '../../styles/AdminSidebar.module.css'; // 💡 ここで styles を定義しています
import { useState } from "react";
export default function ThemeItem({ theme, isOpen, onToggle, onSelect, onAddQuestion, onThemeEdit }) {
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };
    return (
        <div className={styles.themeItem}>
            {/* 💡 ヘッダークリック時に「進捗画面を表示」を呼び出す */}
            <div className={styles.themeHeader} onClick={() => { onThemeEdit(theme.pdfId); }}>
                <span
                    style={{
                        display: "block",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        width: "100%",          // 親要素の幅に合わせて縮む
                        minWidth: 0             // ★これ重要：Flexboxの限界突破を防ぐ
                    }}
                    className={styles.themeTitle}
                    title={theme.title}
                >
                    {truncateText(theme.title, 15)}
                </span>
                <span
                    style={{
                        fontSize: "12px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        fontWeight: "bold",
                        flexShrink: 0,
                        background: theme.status === "published" ? "#dcfce7" : "#fef3c7",
                        color: theme.status === "published" ? "#166534" : "#92400e",
                    }}
                >
                    {theme.status === "published" ? "公開中" : "非公開"}
                </span>
            </div>

            {/* 開閉アイコンや展開動作は必要に応じてここを調整 */}
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
        </div>
    );
}