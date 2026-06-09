import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import AdminConsole from "./features/admin/pages/AdminConsole"; // さっき直した管理者画面にゃ！
import MainScreen from "./features/general/pages/MainScreen"; // さっき直したユーザーダッシュボードにゃ！
import Register from "./features/general/pages/Register"; // さっき直した登録画面にゃ！

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
