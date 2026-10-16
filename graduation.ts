//型定義

type Priority = "low" | "medium" | "high" | "critical";
type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";

interface Task {
  readonly id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: number | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
}

interface User {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  isActive: boolean;
}

interface ApiError {
  code: number;
  message: string;
  timestamp: string;
}

// Result型
interface Success<T> {
  readonly ok: true;
  readonly data: T;
}
interface Failure<E> {
  readonly ok: false;
  readonly error: E;
}
type Result<T, E> = Success<T> | Failure<E>;

function success<T>(data: T): Success<T> {
  return { ok: true, data };
}
function failure<E>(error: E): Failure<E> {
  return { ok: false, error };
}

//ジェネリクス非同期フェッチ
async function fetchData<T>(
  url: string,
): Promise<Success<T> | Failure<ApiError>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return failure({
        code: response.status,
        message: response.statusText,
        timestamp: new Date().toISOString(),
      });
    }
    const data: T = await response.json();
    return success(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return failure({
      code: 0,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
//Unility Types
type TaskSummary = Pick<Task, "id" | "title" | "status" | "priority">;
type TaskUpdateInput = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;
type TaskCreateInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<Priority, number>;
  overdueCount: number;
  completionRate: number;
}

//型ガード
interface OverdueTask extends Task {
  dueDate: string;
  status: "todo" | "in_progress";
}
interface HighPriorityTask extends Task {
  priority: "high" | "critical";
}
function isOverdue(task: Task): task is OverdueTask {
  if (task.dueDate === null) return false;
  if (task.status === "done" || task.status === "cancelled") return false;
  return new Date(task.dueDate) < new Date();
}
function isHighPriority(task: Task): task is HighPriorityTask {
  return task.priority === "high" || task.priority === "critical";
}
//集計関数
function calculateStats(tasks: Task[]): TaskStats {
  const byStatus: Record<TaskStatus, number> = {
    todo: 0,
    in_progress: 0,
    done: 0,
    cancelled: 0,
  };
  const byPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };
  let overdueCount = 0;
  const now = new Date();

  for (const task of tasks) {
    byStatus[task.status]++;
    byPriority[task.priority]++;
    if (
      task.dueDate !== null &&
      new Date(task.dueDate) < now &&
      task.status !== "done" &&
      new Date(task.dueDate) < now
    )
      overdueCount++;
  }

  const total = tasks.length;
  const completedCount = byStatus["done"];
  const completionRate = total === 0 ? 0 : (completedCount / total) * 100;
  return {
    total,
    byStatus,
    byPriority,
    overdueCount,
    completionRate,
  };
}

//サンプルデータと実行
const sampleTasks: Task[] = [
  {
    id: 1,
    title: "API設計仕様書作成",
    description: "API設計仕様書を作成するタスク",
    status: "todo",
    priority: "medium",
    assigneeId: 1,
    tags: ["API", "設計"],
    createdAt: "2024-06-01",
    updatedAt: "2024-06-01",
    dueDate: "2024-06-30",
  },
  {
    id: 2,
    title: "Task 2",
    status: "in_progress",
    description: "機能実装",
    priority: "high",
    assigneeId: 2,
    tags: ["実装", "認証"],
    createdAt: "2024-07-01",
    updatedAt: "2024-07-01",
    dueDate: "2024-07-30",
  },
  {
    id: 3,
    title: "Task 3",
    status: "todo",
    description: "テスト",
    priority: "medium",
    assigneeId: 3,
    tags: ["テスト"],
    createdAt: "2024-08-01",
    updatedAt: "2024-08-01",
    dueDate: "2024-08-30",
  },
];

const stats = calculateStats(sampleTasks);
console.log("統計", stats);
console.log("期限切れ", stats.overdueCount);
console.log("高優先度", sampleTasks.filter(isHighPriority).length);
