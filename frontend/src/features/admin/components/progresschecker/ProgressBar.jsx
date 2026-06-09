export default function ProgressBar({ rate }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
                flex: 1,
                height: 10,
                background: "#edf2f7",
                borderRadius: 6,
                overflow: "hidden"
            }}>
                <div
                    style={{
                        width: `${rate}%`,
                        height: "100%",
                        background: rate === 100 ? "#28a745" : "#0066cc",
                        transition: "width 0.3s"
                    }}
                />
            </div>

            <div style={{
                fontWeight: "bold",
                color: rate === 100 ? "#28a745" : "#0066cc",
                minWidth: 40
            }}>
                {rate}%
            </div>
        </div>
    );
}