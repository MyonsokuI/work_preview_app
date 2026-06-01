import { useState } from 'react'
import './App.css'
import AdminConsole from "./pages/admin/AdminConsole"
function App() {
  // "home" ならテーマ一覧、"questions" なら問題一覧を表示する
  const [screen, setScreen] = useState("home");
  const [selectedThemeId, setSelectedThemeId] = useState(null);

  // テーマがクリックされた時にHomeから呼ばれる関数
  const handleSelectTheme = (themeId) => {
    setSelectedThemeId(themeId);
    setScreen("questions"); // 画面を問題一覧に切り替え
  };

  // テーマ一覧に戻る関数
  const handleBackToHome = () => {
    setScreen("home");
    setSelectedThemeId(null);
  };

  return (
    <AdminConsole />
  )
}

export default App