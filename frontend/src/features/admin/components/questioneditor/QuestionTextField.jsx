export default function QuestionTextField({ value, onChange }) {
    return (
        <div>
            <label>問題文</label>
            <textarea
                rows={4}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="問題文を入力"
                style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #cbd5e1",
                    borderRadius: 6
                }}
            />
        </div>
    );
}