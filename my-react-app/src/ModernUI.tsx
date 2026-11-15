import React from 'react';

interface TaskCardProps {
  title: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
}

// 優先度に応じたボーダー色のマッピング（動的結合エラーを防ぐため完全な文字列で定義）
const priorityBorderColors: Record<TaskCardProps['priority'], string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
};

function TaskCard({ title, priority, isCompleted }: TaskCardProps) {
  return (
    <div
      className={`rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-all border-l-4 ${
        priorityBorderColors[priority]
      } ${isCompleted ? 'opacity-60 bg-gray-50 dark:bg-gray-900' : ''}`}
    >
      {/* CardHeader */}
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {priority}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {isCompleted ? '完了' : '進行中'}
          </span>
        </div>
        <h3 className={`text-lg font-semibold leading-none tracking-tight ${isCompleted ? 'line-through text-gray-500' : ''}`}>
          {title}
        </h3>
      </div>

      {/* CardContent */}
      <div className="p-6 pt-2 pb-4 text-sm text-gray-600 dark:text-gray-400">
        shadcn/uiの構造を模したコンポーネント。
      </div>

      {/* CardFooter */}
      <div className="flex items-center p-6 pt-0">
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 h-9 px-4 py-2 w-full">
          {isCompleted ? '未完了に戻す' : '完了にする'}
        </button>
      </div>
    </div>
  );
}

export function TaskList() {
  const tasks: TaskCardProps[] = [
    { title: 'Tailwind CSSの環境構築', priority: 'high', isCompleted: true },
    { title: 'shadcn/uiコンポーネントの導入', priority: 'medium', isCompleted: false },
    { title: 'レスポンシブデザインの実装', priority: 'low', isCompleted: false },
    { title: 'ダークモード切り替え機能のテスト', priority: 'high', isCompleted: false },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        タスク管理ダッシュボード
      </h2>
      {/* 要件4: レスポンシブなGridレイアウト (モバイル1列、md:2列、lg:3列) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            title={task.title}
            priority={task.priority}
            isCompleted={task.isCompleted}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
