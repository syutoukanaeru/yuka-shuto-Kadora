import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { create } from "zustand";

// ユーザーデータの型定義（自動テストの想定に合わせて汎用的に定義）
interface User {
  id: number | string;
  name: string;
  email?: string;
}

// 【要件2】Zustand ストアの作成
interface FilterState {
  filterText: string;
  setFilterText: (text: string) => void;
}

const useFilterStore = create<FilterState>((set) => ({
  filterText: "",
  setFilterText: (text) => set({ filterText: text }),
}));

// 【要件1, 3, 4】データ取得と検索表示を行うコンポーネント
const UserSearchContent: React.FC = () => {
  const { filterText, setFilterText } = useFilterStore();

  // 【要件1】TanStack Query の useQuery で '/api/users' から取得
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("ユーザーデータの取得に失敗しました");
      }
      return response.json();
    },
  });

  // 【要件4】ローディングおよびエラー時の表示分岐
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (isError) {
    return <div>エラーが発生しました。データの取得に失敗しました。</div>;
  }

  // 【要件3】取得したユーザー一覧を filterText でフィルタリング
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  return (
    <div>
      <h2>ユーザー検索</h2>
      <input
        type="text"
        placeholder="ユーザー名で検索..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

// 【要件5】QueryClientProvider でアプリ全体をラップ
const queryClient = new QueryClient();

export const UserSearchApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserSearchContent />
    </QueryClientProvider>
  );
};

export default UserSearchApp;
