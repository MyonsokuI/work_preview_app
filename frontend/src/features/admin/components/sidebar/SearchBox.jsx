export default function SearchBox({ value, onChange }) {
    return (
        <div>
            <input
                type="text"
                placeholder="🔍 テーマ・問題文から検索..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "13px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box"
                }}
            />
        </div>
    );
}