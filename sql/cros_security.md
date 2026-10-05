# CORSポリシーと安全な設定方法

## 1.概要

本ドキュメントは、Webアプリケーションにおける同一オリジンポリシーの仕組みと、CORS（Cross-Origin Resource Sharing）を安全に設定・運用するために指針をまとめたものである。

---

## 2.CORSエラーが発生する根本原因

### ① 同一オリジンポリシー（Same-Origin Policy）

ブラウザには、ユーザーを悪意のあるスクリプトから保護するため「異なるオリジン（スキーム、ドメイン、ポートの組み合わせ）間で、JavaScriptによるリソースの読み取りを制限する」という **同一オリジンポリシー** が組み込まれている。

### ②CROSエラーのメカニズム。

フロントエンドとバックエンドのオリジンが異なる状態で通信を行う際、バックエンド側が適切なCORS許可ヘッダーを返却しないと、ブラウザは安全のためにレスポンスデータの読み取りを遮断し、CORSエラー（Cross-Origin Read Blocking 等）を発生させます。

## 3. 安全なCORS設定のためのHTTPレスポンスヘッダー

Webサーバー（バックエンド）が特定オリジン `https://guild-office.com` からの GET および POST リクエストのみを許可するためには、以下のHTTPレスポンスヘッダーをクライアントへ返却する。

1. **Access-Control-Allow-Origin**
   - 設定値: `https://guild-office.com`
   - 概要: リソースへのアクセスを許可する単一のオリジンを明示的に指定する。
2. **Access-Control-Allow-Methods**
   - 設定値: `GET, POST`
   - 概要: 許可するHTTPリクエストメソッドを絞り込んで指定する。

```http
Access-Control-Allow-Origin: [https://guild-office.com](https://guild-office.com)
Access-Control-Allow-Methods: GET, POST
```

## 4. 本番環境におけるワイルドカード (\*) 利用の危険性

本番環境で Access-Control-Allow-Origin: \* を設定すると、インターネット上のあらゆるウェブサイト（悪意のある第三者のオリジンを含む）からのAPIアクセスやデータ取得が許可されてしまうため、認証が必要なAPIや社内向けデータへの不正アクセス、クロスサイトでの機密情報窃取（情報漏洩）のリスクが非常に高くなるため、本番環境では絶対にワイルドカードを使用せず、アクセスを許可するオリジンを厳密に個別指定する必要があります。
