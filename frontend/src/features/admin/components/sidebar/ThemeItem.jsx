import styles from '../../styles/AdminSidebar.module.css'; // 💡 ここで styles を定義しています
import { useState } from "react";
export default function ThemeItem({ theme, isOpen, onToggle, onSelect, onAddQuestion, onShowProgress }) {
    return (
        <div className={styles.themeItem}>
            {/* 💡 ヘッダークリック時に「進捗画面を表示」を呼び出す */}
            <div className={styles.themeHeader} onClick={() => onShowProgress(theme.pdfId)}>
                <span style={{ fontWeight: '600' }}>{theme.title}</span>
                <span
                    style={{
                        marginLeft: "8px",
                        fontSize: "11px",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        background: theme.status === "published" ? "#dcfce7" : "#f3f4f6",
                        color: theme.status === "published" ? "#166534" : "#6b7280",
                    }}
                >
                    {theme.status === "published" ? "公開" : "非公開"}
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