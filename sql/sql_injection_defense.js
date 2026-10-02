function safeQuery(tenplate, params) {
  let index = 0; // パラメーター化クエリ用のインデックスを初期化
  return tenplate.replace(/\?/g, () => {
    const val = params[index++];
    if (val === null || val === undefined) return "NULL";
    if (typeof val === "number") return val;
    return "'" + String(val).replace(/'/g, "''") + "'";
  });
}

function validateInput(value, type) {
  if (type === "integer") {
    if (!/^\d+$/.test(String(value)))
      throw new Error("整数値のみ許可されています");
    return String(value, 10);
  }
  if (type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
      throw new Error("メール形式が不正です");
    return value.trim().toLowerCase();
  }
  throw new Error("不正な入力タイプです");
}

//テスト
console.log(
  safeQuery("SELECT * FROM users WHERE email = ? AND name = ?", [
    42,
    "O'Connor",
  ]),
);
console.log(validateInput("123", "integer"));
console.log(validateInput("test@example.com", "email"));
