// ThemeCreateSection.jsx
export default function ThemeCreateSection({ onAddTheme }) {
    return (
        <div style={{ border: "1px solid #e2e8f0", padding: "10px", borderRadius: "6px", backgroundColor: "#fff" }}>
            <button
                onClick={() => { onAddTheme(); console.log("ok"); }} // 💡 押した瞬間に AdminConsole の handleStartAddTheme を呼ぶ
                style={{
                    width: "100%", padding: "8px", backgroundColor: "#0066cc", color: "#fff",
                    border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer"
                }}
            >
                ➕ 新しいテーマを作成する
            </button>
        </div>
    );
}