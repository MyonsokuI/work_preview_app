import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import AdminConsole from "./features/admin/pages/AdminConsole";

// 移動した位置（features/general/screens/MainScreen）を指定
import MainScreen from "./features/general/screens/MainScreen";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 初期アクセスはログインへ */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ログイン */}
        <Route path="/login" element={<Login />} />

        {/* 管理者画面 */}
        <Route
          path="/admin/console"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminConsole />
            </ProtectedRoute>
          }
        />

        {/* ユーザーダッシュボード */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <MainScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}