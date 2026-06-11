export default function ScheduleFields({
    status,
    setStatus,
    openAt,
    setOpenAt,
    closeAt,
    setCloseAt
}) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            padding: 12,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 6
        }}>
            <div style={{ gridColumn: "1 / -1" }}>
                <label>公開ステータス</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                </select>
            </div>

            <div>
                <label>開始</label>
                <input
                    type="datetime-local"
                    value={openAt}
                    onChange={(e) => setOpenAt(e.target.value)}
                />
            </div>

            <div>
                <label>終了</label>
                <input
                    type="datetime-local"
                    value={closeAt}
                    onChange={(e) => setCloseAt(e.target.value)}
                />
            </div>
        </div>
    );
}