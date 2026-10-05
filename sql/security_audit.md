# セキュリティ監査・セキュアコーディング報告書

## 1.概要

本報告書は、対象システムにおけるソースコード診断（静的解析）を実施し、検出されたセキュリティ上の脆弱性およびその修正方法
（セキュアコーディング規約）をまとめたものである。

## 2.検出された脆弱性と改善策

### 脆弱性①: SQL インジェクション（SQL Injection）

#### 1.指摘対象コード

```php
// 脆弱性のあるコード例（文字列連結によるSQL構築）
$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE username = '" . $username . "' AND password = '" . $password . "'";
$result = $db->query($query);
```

#### 2.発生メカニズムとセキュリティリスク

入力値（`$_POST['username']` や `$_POST['password']`）をエスケープやプレースホルダー処理を挟まず、文字列連結によってそのままSQL文に組み込んでいる。
これにより、悪意のある第三者が ' OR '1'='1 などの文字列を入力した場合にSQLの構文が改変され、データベース内の意図しないデータ漏洩や認証回避、データの改ざん・削除が実行されるリスクがある。

#### 3.修正後コード（プレースホルダー、プリペアドステートメントの適用）

```php
// 安全なコード例（プリペアドステートメントの使用）
$username =$_POST['username'];
$password =$_POST['password'];

// プレースホルダー（?）を使用したSQL文の準備
$stmt =$db->prepare("SELECT * FROM users WHERE username = ? AND password = ?");

// バインド処理を行い実行
$stmt->bind_param("ss", $username, $password);$stmt->execute();
$result =$stmt->get_result();
```

### 脆弱性②: クロスサイトスクリプティング（XSS: Cross-Site Scripting）

#### 1. 指摘対象コード

```PHP
// 脆弱性のあるコード例（エスケープなしで出力）
$username = $_POST['username'];

echo "<div>ようこそ、" . $username . "さん</div>";
```

#### 2. 発生メカニズムとセキュリティリスク

ユーザーから受け取った入力値をエスケープ処理（サニタイズ）せずにそのままHTMLに出力している。
これにより、<script>alert('XSS')</script> などの悪意のあるJavaScriptコードが注入された場合、訪問者のブラウザ上でスクリプトが実行され、セッションハイジャックや悪意のあるサイトへのリダイレクトなどの被害が発生するリスクがある。

#### 3. 修正後コード（HTMLエスケープ処理の適用）

```PHP
// 安全なコード例（htmlspecialcharsによるエスケープ）
$username = $_POST['username'];

// 特殊文字をHTMLエンティティに変換
$escaped_username = htmlspecialchars($username, ENT_QUOTES, 'UTF-8');

echo "<div>ようこそ、" . $escaped_username . "さん</div>";
```

### 4.再発防止策・セキュアコーディング規約

#### ①プリペアドステートメントの徹底

データベースクエリを発行する際は、必ずプレースホルダー（バインド変数）を使用し、文字列連結によるクエリ構築を行わないこと。

#### ②入力値検証

外部から受け取るパラメータに対して、型や長さのバリデーションを事前に実施すること。
