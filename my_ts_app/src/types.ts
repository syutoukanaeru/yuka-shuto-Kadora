interface User {
    id: number;
    name: string;
    role: "admin" | "editor" | "viewer";
    email?: string; // 任意のメールアドレス
}
    const admin: User = {
        id: 1,
        name: "Admin User",
        role: "admin",
        email: "admin@example.com"
    };

    const editor: User = {
        id: 2,
        name: "Editor User",
        role: "editor",
        email: "editor@example.com"
    };
S
console.log(admin);
console.log(editor);


