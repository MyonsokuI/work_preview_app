export default function ProgressChecker({ currentTheme, currentProgress }) {
    return (
        <div style={{ maxWidth: "800px" }}>
            <h3>【進捗サマリー】 {currentTheme?.name}</h3>

            <div style={{ backgroundColor: "#f0f0f0", borderRadius: "8px", padding: "20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ fontSize: "16px" }}>
                    修了者: <strong>{currentProgress.completedCount}名</strong> / 全体: {currentProgress.totalCount}名
                </div>
                <div style={{ flex: 1, backgroundColor: "#e0e0e0", borderRadius: "10px", height: "20px", overflow: "hidden" }}>
                    <div style={{ width: `${currentProgress.completionRate}%`, backgroundColor: "#28a745", height: "100%", transition: "width 0.3s" }}></div>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
                    {currentProgress.completionRate}%
                </div>
            </div>

            <h3>⚠️ 未完了者リスト</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
                        <th style={{ padding: "12px", textAlign: "left", fontSize: "14px" }}>受講者名</th>
                        <th style={{ padding: "12px", textAlign: "center", fontSize: "14px" }}>未回答の問題数</th>
                        <th style={{ padding: "12px", textAlign: "right", fontSize: "14px" }}>最終アクティブ日</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProgress.uncompletedUsers.map((user) => (
                        <tr key={user.userId} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "12px", fontSize: "14px", fontWeight: "bold" }}>{user.name}</td>
                            <td style={{ padding: "12px", textAlign: "center", fontSize: "14px", color: "#dc3545", fontWeight: "bold" }}>
                                あと {user.remainingCount} 問
                            </td>
                            <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", color: "#666" }}>{user.lastActive}</td>
                        </tr>
                    ))}
                    {currentProgress.uncompletedUsers.length === 0 && (
                        <tr>
                            <td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "#28a745", fontWeight: "bold" }}>
                                🎉 全員すべての課題を完了しています！
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}