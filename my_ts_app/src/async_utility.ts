interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}
//新規作成用（Omitを使用）
type CreateTodoDTO = Omit<Todo, "id">;

//更新用（Partial + Omitを使用）
type UpdateTodoDTO = Partial<Omit<Todo, "id">>;

//一覧表示用（TodoSummary:idとtitleのみ）
type TodoSummary = Pick<Todo, "id" | "title">;

const newTodo: CreateTodoDTO = {
  title: "New Task",
  completed: false,
  userId: 1,
};
const updateTodo: UpdateTodoDTO = {
  completed: true
};

const summary : TodoSummary = {
  id: 1,
  title: "Task 1"
};

console.log("新規作成",newTodo);
console.log("更新",updateTodo);
console.log(summary);

