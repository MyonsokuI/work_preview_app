import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/registerApi";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        employeeId: "",
        name: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (form.password !== form.confirmPassword) {
            setMessage("パスワードが一致しません");
            return;
        }

        try {
            await authApi.registerUser(form.employeeId, form.name, form.password);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setMessage(err.message || "登録に失敗しましたにゃ");
        }
    };

    // 入力項目の定義（UIを一括管理）
    const formFields = [
        {
            label: "社員ID",
            name: "employeeId",
            type: "number",
            placeholder: "例：12345678",
        },
        {
            label: "名前",
            name: "name",
            type: "text",
            placeholder: "氏名を入力",
        },
        {
            label: "パスワード",
            name: "password",
            type: "password",
            placeholder: "8～20文字で入力",
        },
        {
            label: "パスワード（確認）",
            name: "confirmPassword",
            type: "password",
            placeholder: "もう一度入力",
        },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>ユーザー登録</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {formFields.map((field) => (
                        <div key={field.name} style={styles.fieldWrapper}>
                            <label style={styles.label}>{field.label}</label>

                            <input
                                style={styles.input}
                                type={field.type}
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" style={styles.button}>
                        登録する
                    </button>
                </form>

                {message && (
                    <div style={styles.errorBox}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

// モダンなUIのためのスタイル定義
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#fff",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    },
    title: {
        textAlign: "center",
        color: "#1e293b",
        marginBottom: "24px",
        fontSize: "24px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    fieldWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#64748b",
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "16px",
        outline: "none",
    },
    button: {
        marginTop: "8px",
        padding: "14px",
        width: "100%",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background 0.2s",
    },
    message: {
        marginTop: "16px",
        color: "#ef4444",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "500",
    },
    passwordHint: {
        fontSize: "12px",
        color: "#64748b",
        marginTop: "4px",
    },

    errorBox: {
        marginTop: "16px",
        padding: "12px",
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "500",
    },
};