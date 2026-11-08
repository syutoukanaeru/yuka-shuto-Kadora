import React, { createContext, useContext } from 'react';

// 1. 型定義とコンテキストの作成
interface ThemeContextType {
  theme: string;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light' });

// 2. 最下層のコンポーネント (GrandChild)
function GrandChild() {
  const { theme } = useContext(ThemeContext);
  return <p>現在のテーマは {theme} です</p>;
}

// 3. 中間コンポーネント (Child)
// Props は一切受け渡さず、ただ GrandChild を描画する
function Child() {
  return <ChildContent />;
}

function ChildContent() {
  return <GrandChild />;
}

// 4. 親コンポーネント (App)
// value に 'dark' を設定した Provider で配下を囲む
export default function App() {
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      <div>
        <Child />
      </div>
    </ThemeContext.Provider>
  );
}
