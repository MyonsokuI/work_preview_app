export default function ThemeCreateForm({ onSubmit, onClose }) {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("draft");

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title, status }); }} style={{ display: "flex", flexDirection: "column", gap: "8px", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "6px" }}>
            <div style={{ fontWeight: "bold", fontSize: "12px" }}>新規テーマ登録</div>
            <input placeholder="テーマ名" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: "6px", fontSize: "12px" }} required />
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "4px", fontSize: "12px" }}>
                <option value="draft">未公開</option>
                <option value="published">公開</option>
            </select>
            <div style={{ display: "flex", gap: "4px" }}>
                <button type="submit" style={{ flex: 1, padding: "6px", fontSize: "12px" }}>保存</button>
                <button type="button" onClick={onClose} style={{ padding: "6px", fontSize: "12px" }}>✕</button>
            </div>
        </form>
    );
}