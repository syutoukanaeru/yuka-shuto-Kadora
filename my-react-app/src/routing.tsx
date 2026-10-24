\`\`\`tsx
import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  Navigate,
  Outlet
} from 'react-router-dom';

// 1. ホームコンポーネント
function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🏠 ウェルカムホーム！</h2>
      <p>React Router によるスムーズな画面遷移の世界へようこそ！</p>
    </div>
  );
}

// 2. 詳細コンポーネント (動的パラメータ取得)
function Detail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div style={{ padding: '20px' }}>
      <h2>📦 アイテム詳細画面</h2>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
        アイテムID: <span style={{ color: '#0070f3' }}>{id}</span>
      </p>
    </div>
  );
}

// ログイン画面 (Advanced 用)
function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🔒 ログイン画面</h2>
      <button onClick={onLogin} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        ログインする
      </button>
    </div>
  );
}

// 3. (Advanced) 保護ルートコンポーネント
function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    // 未認証ならログインへリダイレクト
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// 4. メインルーティングコンポーネント
export default function AppRouter() {
  // ログイン状態の管理 (デモ用)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif' }}>
        {/* ナビゲーションバー */}
        <nav style={{ padding: '15px', background: '#f0f0f0', display: 'flex', gap: '15px' }}>
          <Link to="/">ホーム</Link>
          <Link to="/items/42">アイテム42の詳細</Link>
          <Link to="/items/99">アイテム99の詳細</Link>
          <span style={{ marginLeft: 'auto' }}>
            ステータス: {isLoggedIn ? '✅ ログイン中' : '❌ 未ログイン'}
          </span>
        </nav>

        {/* ルーティング定義 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />

          {/* 保護ルート適用の例 (ログインしていないと Detail が見られない) */}
          <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
            <Route path="/items/:id" element={<Detail />} />
          </Route>

          {/* 404 ページ */}
          <Route path="*" element={<h2 style={{ padding: '20px' }}>404: ページが存在しません</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
\`\`\`
`
