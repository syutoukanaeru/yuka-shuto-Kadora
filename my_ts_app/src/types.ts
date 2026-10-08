interface User {
  name: string;
  age: number;
  role: "admin" | "editor" | "viewer";
  email?: string; // 任意のメールアドレス
}
const admin: User = {
  name: "Admin User",
  age: 30,
  role: "admin",
};

const editor: User = {
  name: "Editor User",
  age: 25,
  role: "editor",
};

console.log(admin);
console.log(editor);
