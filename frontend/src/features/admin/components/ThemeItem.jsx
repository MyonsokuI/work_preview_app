export default function ThemeItem({ theme, activeQuestionId, activeTab, onSelect, onAddQuestion, onDeleteQuestion }) {
    return (
        <div style={{ marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
            <div onClick={() => onSelect(theme.pdfId, null, "progress")} style={{ fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
                ▼ {theme.title}
            </div>
            <div style={{ marginLeft: "12px", marginTop: "4px" }}>
                {theme.questions?.map((q) => (
                    <div key={q.questionId} onClick={() => onSelect(theme.pdfId, q.questionId, "edit")} style={{ fontSize: "12px", padding: "6px", cursor: "pointer" }}>
                        ❓ {q.questionText}
                        <button onClick={(e) => { e.stopPropagation(); onDeleteQuestion(theme.pdfId, q.questionId); }}>✕</button>
                    </div>
                ))}
                <button onClick={() => onAddQuestion(theme.pdfId)} style={{ fontSize: "11px" }}>➕ 問題追加</button>
            </div>
        </div>
    );
}