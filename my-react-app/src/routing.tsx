import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  Navigate,
  Outlet,
} from "react-router-dom";

// 1. ホームコンポーネント
function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>ウェルカムホーム！</h2>
      <p>React Routerの世界へようこそ！</p>
    </div>
  );
}

// 2. 詳細コンポーネント (動的パラメータ取得)
function Detail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div style={{ padding: "20px" }}>
      <h2>アイテム詳細画面</h2>
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        アイテムID: <span style={{ color: "#0070f3" }}>{id}</span>
      </p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* 要件3: ナビゲーション用 <Link> タグ */}
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>
          Homeへ
        </Link>
        <Link to="/items/42">Item 42へ</Link>
      </nav>

      {/* 要件2: BrowserRouter, Routes, Route によるルーティング定義 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items/:id" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
}

