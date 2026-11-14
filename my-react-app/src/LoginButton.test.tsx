import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// 1. テスト対象の LoginButton コンポーネント
interface LoginButtonProps {
  initialIsLoggedIn?: boolean; // (任意) Props の初期値
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  initialIsLoggedIn = false,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  return (
    <div>
      <p>
        {isLoggedIn ? "ログアウト中またはログイン済み" : "ログインしてください"}
      </p>
      {/* わかりやすくテキストが変わるボタンの例 */}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? "ログアウト" : "ログイン"}
      </button>
    </div>
  );
};

// 2. テストケースの記述
describe("LoginButton コンポーネントのテスト", () => {
  // 要件 2: クリックイベントの前後で表示されるテキストの変化を検証
  it("ボタンをクリックすると表示されるテキストとボタンのラベルが切り替わること", () => {
    // 描画 (render)
    render(<LoginButton />);

    // 初期状態の検証 (ログイン前)
    const buttonElement = screen.getByRole("button", { name: "ログイン" });
    expect(buttonElement).toBeInTheDocument();
    expect(screen.getByText("ログインしてください")).toBeInTheDocument();

    // クリックイベントの実行 (fireEvent.click)
    fireEvent.click(buttonElement);

    // クリック後の検証 (ログイン後)
    expect(
      screen.getByRole("button", { name: "ログアウト" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ログアウト中またはログイン済み"),
    ).toBeInTheDocument();
  });

  // 要件 3: (任意) Props の初期値判定に関するテストケース
  it("initialIsLoggedIn に true を渡したとき、初期状態でログイン状態として描画されること", () => {
    render(<LoginButton initialIsLoggedIn={true} />);

    // 初期からログアウトボタンが表示されていることを検証
    expect(
      screen.getByRole("button", { name: "ログアウト" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ログアウト中またはログイン済み"),
    ).toBeInTheDocument();
  });
});
