# システム構造化ログ設計書

## 1.概要
本ドキュメントは、アプリケーションの運用監視、障害原因追跡（オブザーバビリティ）、およびセキュリティ監査を目的とした構造化ログ（JSON形式）の出力仕様および個人情報保護基準を定義するものである。

## 2.共通ログフォーマット（JSONスキーマ）
すべてのログ出力は、ログ収集ツール（Datadog,CloudWaatch　等）での自動バースおよび検索を可能にするため、統一されたJSONオブジェクト形式で書き出す。

### JSONスキーマ定義例（認証失敗イベント）
### JSON スキーマ定義例 (認証失敗イベント)
```json
{
  "$schema": "[https://json-schema.org/draft/2020-12/schema](https://json-schema.org/draft/2020-12/schema)",
  "title": "AuthFailureLogEvent",
  "type": "object",
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ログ出力日時 (ISO 8601形式)"
    },
    "level": {
      "type": "string",
      "enum": ["INFO", "WARN", "ERROR", "FATAL"],
      "description": "ログレベル"
    },
    "message": {
      "type": "string",
      "description": "ログメッセージ本文"
    },
    "userId": {
      "type": ["string", "null"],
      "description": "操作を行ったユーザーID（未認証時はnull）"
    },
    "ip": {
      "type": "string",
      "format": "ipv4",
      "description": "クライアントのIPアドレス"
    },
    "eventId": {
      "type": "string",
      "description": "イベント識別子（例: AUTH_FAILURE）"
    },
    "details": {
      "type": "object",
      "description": "追加詳細情報（失敗理由等）"
    }
  },
  "required": ["timestamp", "level", "message", "ip", "eventId"]
}
```

## 3.ログレベル運用基準
### ①　INFO: 通常の正常動作（ユーザーログイン成功、データ登録完了など）

### ②　WARN: 注意が必要な状態・失敗（ログイン認証失敗、API呼び出しリトライなど）

### ③　ERROR: システム機能の一部エラー（データベース接続一時失敗、外部連携エラーなど）

### ④　FATAL: システム継続不可能な致命的障害

## 4. セキュリティとマスキングルール

・出力禁止項目: パスワード、アクセストークン、クレジットカード情報、生年月日などの機密情報（PII）はログ本文や details 内へ含めてはならない。

・マスキング処理: メールアドレスや氏名を出力する場合は、ハッシュ化または一部伏字化（例: u***@example.com）を行って出力する。
