export default function LogoutSection({ onLogout }) {
    return (
        <div style={{
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <h3 style={{ margin: 0, fontSize: "15px", color: "#555" }}>
                管理者フォーム
            </h3>

            <button
                onClick={onLogout}
                style={{
                    padding: "6px 12px",
                    backgroundColor: "#e2e8f0",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "12px"
                }}
            >
                ログアウト
            </button>
        </div>
    );
}