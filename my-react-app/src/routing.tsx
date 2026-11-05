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

