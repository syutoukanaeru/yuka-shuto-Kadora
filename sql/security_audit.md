# セキュリティ監査・セキュアコーティング報告書

## 1.概要
本報告書は、対象システムにおけるソースコード診断（性的解析）を実施し、検出されたセキュリティ上の惰弱性およびその修正方法
（セキュアコーティング規約）をまとめたものである。

## 2.検出された惰弱性と改善命令

### 惰弱性①: SQL インジェクション（SQL Injection）

#### 1.指摘対象コード
```php
// 脆弱性のあるコード例（文字列連結によるSQL構築）
$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE username = '" . $username . "' AND password = '" . $password . "'";
$result = $db->query($query);
```

#### 2.発生メカニズムとセキュリティリスク
入力値（$_POST['username'] や $_POST['password']）をエスケープやプレースホルダー処理を挟まず、文字列連結によってそのままSQL文に組込んでいる。
これにより、悪意のある第三者が ' OR '1'='1 などの文字列を入力した場合にSQLの構文が改変され、データベース内の意図しないデータ漏洩や認証回避、データの改ざん・削除が実行されるリスクがある。

### 3.修正後コード（プレスホルダー、プレパードステートメントの適用）
// 安全なコード例（プレパードステートメントの使用）
$username =$_POST['username'];
$password =$_POST['password'];

// プレースホルダー（?）を使用したSQL文の準備
$stmt =$db->prepare("SELECT * FROM users WHERE username = ? AND password = ?");

// バインド処理を行い実行
$stmt->bind_param("ss", $username, $password);$stmt->execute();
$result =$stmt->get_result();

### 4.再発防止策・セキュアコーティング規約

#### ①プレパードステートメントの徹底
データベースクエリを発行する際は、必ずプレースホルダー（バインド変数）を使用し、文字列連結によるクエリ構築を行わないこと。

#### ②入力値検証
外部から受け取るパラメータに対して、型や長さのバリデーションを事前に実施すること。



