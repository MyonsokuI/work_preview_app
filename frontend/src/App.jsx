import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminConsole from "./pages/admin/AdminConsole"; // さっき直した管理者画面にゃ！
import MainScreen from "./pages/general/MainScreen"; // さっき直したユーザーダッシュボードにゃ！
import Register from "./pages/general/Register"; // さっき直した登録画面にゃ！

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 💡 初期URL (/) にアクセスされたら自動的にログイン画面に変えるにゃ */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 各画面のパス設定 */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/console" element={<AdminConsole />} />
        <Route path="/user/dashboard" element={<MainScreen />} />
        <Route path="/user/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
