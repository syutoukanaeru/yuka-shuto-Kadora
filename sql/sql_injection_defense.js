function safeQuery(tenplate, params) {
  let index = 0; // Initialize index for parameterized query
  return tenplate.replace(/\?/g, () => {
    const val = params[index++];
    if (val === null || val === undefined) return "NULL";
    if (typeof val === "string") return val;
    return "'" + String(val).replace(/'/g, "''") + "'";
  });

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

    // return String(value); // This line is redundant and can be removed
  }
}
