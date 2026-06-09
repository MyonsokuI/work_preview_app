export default function SubmitButton({ isNewMode }) {
    return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
                type="submit"
                style={{
                    padding: "10px 20px",
                    background: isNewMode ? "#28a745" : "#0066cc",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: "bold",
                    cursor: "pointer"
                }}
            >
                {isNewMode ? "新規作成" : "保存"}
            </button>
        </div>
    );
}