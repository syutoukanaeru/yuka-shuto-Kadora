# ECサイト　カート機能　インターフェース定義書

## 1. CartItem インターフェース

カートに追加された商品1件の情報を表します。

| プロパティ名 | 型     | 必須 | 説明                       |
| ------------ | ------ | ---- | -------------------------- |
| id           | number | Yes  | カートアイテムの一意識別子 |
| productName  | string | Yes  | 商品名                     |
| price        | number | Yes  | 商品の単価（税抜き）       |
| quantity     | number | Yes  | 購入数量                   |

\`\`\`typescript
interface CartItem{
id: number;
productName: string;
price: number;
quantity: number;
}
\`\`\`

## 2. PaymentSummary インターフェース

カート支払情報サマリーを表します。

| プロパティ名 | 型     | 必須 | 説明                           |
| ------------ | ------ | ---- | ------------------------------ |
| subtotal     | number | Yes  | 小計（税抜き合計金額           |
| tax          | number | Yes  | 消費税額                       |
| total        | number | Yes  | 合計金額（税込み）             |
| promoCode    | string | No   | 適用されたプロモーションコード |

\`\`\`typescript
interface PaymentSummary{
subtotal: number;
tax: number;
total: number;
promoCode?: string;

}
\`\`\`
