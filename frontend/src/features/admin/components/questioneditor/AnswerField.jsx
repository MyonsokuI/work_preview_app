export default function AnswerField({ value, onChange }) {
    return (
        <div>
            <label>模範解答（必須）</label>
            <textarea
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="模範解答"
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