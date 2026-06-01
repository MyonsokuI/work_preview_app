import React, { useState } from 'react';

function Login() {
    // 入力値を管理する状態（ステート）
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // APIからのレスポンスを画面に表示するための状態
    const [message, setMessage] = useState('');
    const [loginUser, setLoginUser] = useState(null);

    // ボタンが押された時の処理
    const handleLogin = async (e) => {
        e.preventDefault(); // 画面のリロードを防ぐ

        // バックエンドに送るJSONデータ
        const loginData = {
            username: username,
            password: password
        };

        try {
            // Spring BootのログインAPIを呼び出す
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData), // JSON文字列に変換して送信
            });

            // レスポンスをJSONとして解析
            const result = await response.json();

            // 結果を画面に反映
            if (result.status === 'success') {
                setMessage(result.message);
                setLoginUser(result.data); // ログインしたユーザー情報を保存
            } else {
                setMessage(result.message);
                setLoginUser(null);
            }
        } catch (error) {
            setMessage('サーバーとの通信に失敗しました。');
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '300px', margin: '0 auto' }}>
            <h2>ログイン体験</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>ユーザー名：</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>パスワード：</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%' }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px' }}>
                    ログイン
                </button>
            </form>

            {/* 結果の表示エリア */}
            {message && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    <p><strong>結果:</strong> {message}</p>
                    {loginUser && (
                        <div>
                            <p>ユーザーID: {loginUser.userId}</p>
                            <p>名前: {loginUser.name}</p>
                            <p>権限: {loginUser.role}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Login;