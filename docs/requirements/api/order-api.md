# 注文API仕様書

## 概要

注文関連のAPIエンドポイント仕様です。
Base URL: `/api/v1/orders`

---

## エンドポイント一覧

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | `/` | 注文一覧取得 | 必要 |
| GET | `/{order_id}` | 注文詳細取得 | 必要 |
| POST | `/` | 注文作成 | 必要 |
| POST | `/{order_id}/cancel` | 注文キャンセル | 必要 |

---

## 共通型定義

### OrderStatus（注文ステータス）

| 値 | 説明 |
|----|------|
| `pending` | 保留中 |
| `awaiting_payment` | 支払い待ち |
| `paid` | 支払い済み |
| `awaiting_data` | データ待ち |
| `data_reviewing` | データ確認中 |
| `confirmed` | 確定 |
| `processing` | 処理中 |
| `shipped` | 発送済み |
| `delivered` | 配達済み |
| `cancelled` | キャンセル |

### PaymentMethod（決済方法）

| 値 | 説明 |
|----|------|
| `stripe` | Stripe決済 |
| `bank_transfer` | 銀行振込 |

---

## 1. 注文一覧取得

### `GET /orders`

ログイン中のユーザーの注文一覧を取得します。

#### リクエスト

クエリパラメータで絞り込み・ページネーションが可能です。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|------|------|------------|------|
| status | string | - | - | ステータスフィルタ（OrderStatus） |
| limit | number | - | 20 | 取得件数（1-100） |
| offset | number | - | 0 | オフセット |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-20250104-0001",
      "status": "pending",
      "subtotal": 10000,
      "shipping_fee": 500,
      "tax": 1000,
      "total": 11500,
      "payment_method": "stripe",
      "paid_at": null,
      "shipped_at": null,
      "tracking_number": null,
      "delivered_at": null,
      "cancelled_at": null,
      "notes": "お急ぎでお願いします",
      "created_at": "2025-01-04T12:00:00.000Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| orders | array | 注文一覧 |
| orders[].id | number | 注文ID |
| orders[].order_number | string | 注文番号 |
| orders[].status | string | ステータス（OrderStatus） |
| orders[].subtotal | number | 小計 |
| orders[].shipping_fee | number | 送料 |
| orders[].tax | number | 消費税 |
| orders[].total | number | 合計 |
| orders[].payment_method | string \| null | 決済方法（PaymentMethod） |
| orders[].paid_at | string (ISO 8601) \| null | 支払日時 |
| orders[].shipped_at | string (ISO 8601) \| null | 発送日時 |
| orders[].tracking_number | string \| null | 追跡番号 |
| orders[].delivered_at | string (ISO 8601) \| null | 配達日時 |
| orders[].cancelled_at | string (ISO 8601) \| null | キャンセル日時 |
| orders[].notes | string \| null | 顧客備考 |
| orders[].created_at | string (ISO 8601) \| null | 作成日時 |
| total | number | 総件数 |
| limit | number | 取得件数 |
| offset | number | オフセット |

---

## 2. 注文詳細取得

### `GET /orders/{order_id}`

指定した注文の詳細を取得します（注文明細を含む）。

#### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| order_id | number | ○ | 注文ID |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "order": {
    "id": 1,
    "order_number": "ORD-20250104-0001",
    "status": "pending",
    "shipping_address_id": 1,
    "subtotal": 10000,
    "shipping_fee": 500,
    "tax": 1000,
    "total": 11500,
    "payment_method": "stripe",
    "paid_at": null,
    "shipped_at": null,
    "tracking_number": null,
    "delivered_at": null,
    "cancelled_at": null,
    "cancel_reason": null,
    "notes": "お急ぎでお願いします",
    "created_at": "2025-01-04T12:00:00.000Z",
    "items": [
      {
        "id": 1,
        "product_id": "PROD-001",
        "product_name": "Sample Product",
        "product_name_ja": "サンプル商品",
        "quantity": 2,
        "unit_price": 5000,
        "options": { "size": "M", "color": "red" },
        "subtotal": 10000
      }
    ]
  }
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| order | object | 注文詳細 |
| order.id | number | 注文ID |
| order.order_number | string | 注文番号 |
| order.status | string | ステータス（OrderStatus） |
| order.shipping_address_id | number \| null | 配送先ID |
| order.subtotal | number | 小計 |
| order.shipping_fee | number | 送料 |
| order.tax | number | 消費税 |
| order.total | number | 合計 |
| order.payment_method | string \| null | 決済方法（PaymentMethod） |
| order.paid_at | string (ISO 8601) \| null | 支払日時 |
| order.shipped_at | string (ISO 8601) \| null | 発送日時 |
| order.tracking_number | string \| null | 追跡番号 |
| order.delivered_at | string (ISO 8601) \| null | 配達日時 |
| order.cancelled_at | string (ISO 8601) \| null | キャンセル日時 |
| order.cancel_reason | string \| null | キャンセル理由 |
| order.notes | string \| null | 顧客備考 |
| order.created_at | string (ISO 8601) \| null | 作成日時 |
| order.items | array | 注文明細 |
| order.items[].id | number | 注文明細ID |
| order.items[].product_id | string | 商品ID |
| order.items[].product_name | string | 商品名 |
| order.items[].product_name_ja | string \| null | 商品名（日本語） |
| order.items[].quantity | number | 数量 |
| order.items[].unit_price | number | 単価 |
| order.items[].options | object \| null | 選択オプション |
| order.items[].subtotal | number | 小計 |

---

## 3. 注文作成

### `POST /orders`

新しい注文を作成します。`items`を指定しない場合はカートの内容から注文を作成します。

#### リクエスト

```json
{
  "shipping_address_id": 1,
  "payment_method": "stripe",
  "notes": "お急ぎでお願いします",
  "items": [
    {
      "product_id": "PROD-001",
      "quantity": 2,
      "options": { "size": "M", "color": "red" }
    }
  ]
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| shipping_address_id | number | ○ | 配送先ID |
| payment_method | string | ○ | 決済方法（PaymentMethod） |
| notes | string | - | 顧客備考（最大1000文字） |
| items | array | - | 注文明細（指定しない場合はカートから作成） |
| items[].product_id | string | ○ | 商品ID |
| items[].quantity | number | ○ | 数量（1以上） |
| items[].options | object | - | 選択オプション |

#### レスポンス

**成功時 (201 Created)**

```json
{
  "order": {
    "id": 1,
    "order_number": "ORD-20250104-0001",
    "status": "pending",
    "shipping_address_id": 1,
    "subtotal": 10000,
    "shipping_fee": 500,
    "tax": 1000,
    "total": 11500,
    "payment_method": "stripe",
    "paid_at": null,
    "shipped_at": null,
    "tracking_number": null,
    "delivered_at": null,
    "cancelled_at": null,
    "cancel_reason": null,
    "notes": "お急ぎでお願いします",
    "created_at": "2025-01-04T12:00:00.000Z",
    "items": [
      {
        "id": 1,
        "product_id": "PROD-001",
        "product_name": "Sample Product",
        "product_name_ja": "サンプル商品",
        "quantity": 2,
        "unit_price": 5000,
        "options": { "size": "M", "color": "red" },
        "subtotal": 10000
      }
    ]
  },
  "message": "注文を作成しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| order | object | 作成された注文（注文詳細と同じ形式） |
| message | string | メッセージ |

---

## 4. 注文キャンセル

### `POST /orders/{order_id}/cancel`

注文をキャンセルします。キャンセル可能なステータスは `pending`、`awaiting_payment`、`paid` のみです。

#### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| order_id | number | ○ | 注文ID |

#### リクエスト

```json
{
  "cancel_reason": "商品が不要になったため"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| cancel_reason | string | - | キャンセル理由（最大500文字） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "order": {
    "id": 1,
    "order_number": "ORD-20250104-0001",
    "status": "cancelled",
    "subtotal": 10000,
    "shipping_fee": 500,
    "tax": 1000,
    "total": 11500,
    "payment_method": "stripe",
    "paid_at": null,
    "shipped_at": null,
    "tracking_number": null,
    "delivered_at": null,
    "cancelled_at": "2025-01-04T13:00:00.000Z",
    "notes": "お急ぎでお願いします",
    "created_at": "2025-01-04T12:00:00.000Z"
  },
  "message": "注文をキャンセルしました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| order | object | キャンセルされた注文 |
| message | string | メッセージ |

---

## エラーレスポンス

全エンドポイント共通のエラーレスポンス形式です。

```json
{
  "detail": "エラーメッセージ"
}
```

### 主なHTTPステータスコード

| コード | 説明 |
|--------|------|
| 400 | リクエスト不正（バリデーションエラー、キャンセル不可等） |
| 401 | 認証エラー（未ログイン、トークン無効等） |
| 404 | 注文が見つからない |
| 422 | バリデーションエラー（Pydantic） |
| 500 | サーバーエラー |

---

## 関連ファイル

### バックエンド

- `backend/app/presentation/api/order_api.py` - APIエンドポイント定義
- `backend/app/presentation/schemas/order_schemas.py` - リクエスト/レスポンススキーマ
- `backend/app/application/use_cases/order_usecase.py` - ユースケース実装
- `backend/app/application/schemas/order_schemas.py` - アプリケーション層DTO
- `backend/app/domain/entities/order.py` - ドメインエンティティ
- `backend/app/infrastructure/db/models/order_model.py` - DBモデル
- `backend/app/infrastructure/db/repositories/order_repository_impl.py` - リポジトリ実装
