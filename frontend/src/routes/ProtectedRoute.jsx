import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 1. そもそもログインしていない場合は即ログイン画面へ
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. トークンを解読して役職をチェック
  let userRole = null;
  try {
    const decoded = jwtDecode(token);
    userRole = decoded.roles;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  const hasPermission = !allowedRoles || allowedRoles.includes(userRole);

  // 🌟 ここがポイント！
  // 権限がない場合、画面の描画とは別のタイミング（useEffect）で、1回だけアラートを出して戻す！
  useEffect(() => {
    if (!hasPermission) {
      alert("このページにアクセスする権限がありません！");
      navigate(-1);
    }
  }, [hasPermission, navigate]);

  // 3. 権限がない場合は、中身（children）を絶対に返さず、真っ白な状態で待つ
  if (!hasPermission) {
    return null; 
  }

  // 4. 合格したときだけ、画面の中身を映す
  return children;
}
