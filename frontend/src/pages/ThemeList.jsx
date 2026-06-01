import { useEffect, useState } from "react";

// 引数に「onSelectTheme」を追加
export default function ThemeList({ onSelectTheme }) {
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/themes")
            .then((res) => res.json())
            .then((data) => setThemes(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>テーマ一覧</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {themes.map((theme) => (
                    <div
                        key={theme.pdfId}
                        style={{
                            padding: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                        // ここを変更！クリックされたら親の関数を呼び出す
                        onClick={() => onSelectTheme(theme.pdfId)}
                    >
                        {theme.name}
                    </div>
                ))}
            </div>
        </div>
    );
}