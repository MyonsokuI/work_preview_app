export default function UncompletedUsers({ uncompleted, isOpen, onToggle }) {
    if (!uncompleted.length) {
        return (
            <div style={{ color: "#28a745", fontSize: 12 }}>
                ✨ 全員完了！
            </div>
        );
    }

    return (
        <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 8 }}>
            <button
                onClick={onToggle}
                style={{
                    border: "none",
                    background: "none",
                    color: "#e53e3e",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                ⚠️ 未完了 ({uncompleted.length}) {isOpen ? "▲" : "▼"}
            </button>

            {isOpen && (
                <div style={{
                    marginTop: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    background: "#fff5f5",
                    padding: 8,
                    borderRadius: 6
                }}>
                    {uncompleted.map((name, i) => (
                        <span
                            key={i}
                            style={{
                                background: "#feb2b2",
                                color: "#9b2c2c",
                                fontSize: 12,
                                padding: "2px 8px",
                                borderRadius: 4
                            }}
                        >
                            {name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}