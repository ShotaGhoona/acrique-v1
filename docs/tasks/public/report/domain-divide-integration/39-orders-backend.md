# Orders Backend 実装レポート

## 概要

注文管理のバックエンドAPIを実装。オニオンアーキテクチャに従い、注文一覧・詳細・作成・キャンセル機能を構築した。

---

## 実装したAPI

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/orders` | 注文一覧 |
| POST | `/api/orders` | 注文作成 |
| GET | `/api/orders/{id}` | 注文詳細 |
| POST | `/api/orders/{id}/cancel` | 注文キャンセル |

---

## アーキテクチャ

### Domain層

**エンティティ:**

| ファイル | 説明 |
|----------|------|
| `app/domain/entities/order.py` | Order, OrderItem, OrderStatus, PaymentMethod（新規） |

**リポジトリインターフェース:**

| ファイル | 説明 |
|----------|------|
| `app/domain/repositories/order_repository.py` | IOrderRepository, IOrderItemRepository（新規） |

### Application層

**UseCase:**

| ファイル | 説明 |
|----------|------|
| `app/application/use_cases/order_usecase.py` | 注文ユースケース（新規） |

**スキーマ（DTO）:**

| ファイル | 説明 |
|----------|------|
| `app/application/schemas/order_schemas.py` | 注文入出力DTO（新規） |

### Infrastructure層

**DBモデル:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/models/order_model.py` | OrderModel, OrderItemModel（新規） |

**リポジトリ実装:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/repositories/order_repository_impl.py` | 注文リポジトリ実装（新規） |

### Presentation層

| ファイル | 説明 |
|----------|------|
| `app/presentation/api/order_api.py` | 注文APIエンドポイント（新規） |
| `app/presentation/schemas/order_schemas.py` | 注文リクエスト/レスポンススキーマ（新規） |

### DI層

| ファイル | 説明 |
|----------|------|
| `app/di/order.py` | 注文依存性注入設定（新規） |

---

## DBスキーマ

### orders テーブル

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    order_number VARCHAR(20) UNIQUE NOT NULL,  -- ACQ-240101-001
    status VARCHAR(30) NOT NULL,  -- pending/awaiting_payment/paid/...
    shipping_address_id INT REFERENCES addresses(id),
    subtotal INT NOT NULL DEFAULT 0,
    shipping_fee INT NOT NULL DEFAULT 0,
    tax INT NOT NULL DEFAULT 0,
    total INT NOT NULL DEFAULT 0,
    payment_method VARCHAR(30),  -- stripe/bank_transfer
    stripe_payment_intent_id VARCHAR(255),
    paid_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    tracking_number VARCHAR(100),
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancel_reason TEXT,
    notes TEXT,  -- 顧客備考
    admin_notes TEXT,  -- 管理者メモ
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_orders_user_id ON orders(user_id);
CREATE INDEX ix_orders_order_number ON orders(order_number);
CREATE INDEX ix_orders_status ON orders(status);
CREATE INDEX ix_orders_created_at ON orders(created_at DESC);
```

### order_items テーブル

```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    product_name VARCHAR(200) NOT NULL,  -- スナップショット
    product_name_ja VARCHAR(200),
    quantity INT NOT NULL,
    unit_price INT NOT NULL,
    options JSONB,  -- 選択オプション
    subtotal INT NOT NULL
);

CREATE INDEX ix_order_items_order_id ON order_items(order_id);
CREATE INDEX ix_order_items_product_id ON order_items(product_id);
```

---

## APIレスポンス例

### GET /api/orders

```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ACQ-260104-001",
      "status": "pending",
      "subtotal": 17600,
      "shipping_fee": 0,
      "tax": 1760,
      "total": 19360,
      "payment_method": "stripe",
      "paid_at": null,
      "shipped_at": null,
      "tracking_number": null,
      "delivered_at": null,
      "cancelled_at": null,
      "notes": "テスト注文",
      "created_at": "2026-01-04T01:49:57.245874"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### POST /api/orders

```json
{
  "order": {
    "id": 1,
    "order_number": "ACQ-260104-001",
    "status": "pending",
    "shipping_address_id": 9,
    "subtotal": 17600,
    "shipping_fee": 0,
    "tax": 1760,
    "total": 19360,
    "payment_method": "stripe",
    "notes": "テスト注文",
    "created_at": "2026-01-04T01:49:57.245874",
    "items": [
      {
        "id": 1,
        "product_id": "qr-cube",
        "product_name": "QR Code Cube",
        "product_name_ja": "QRコードキューブ",
        "quantity": 2,
        "unit_price": 8800,
        "options": {"size": "50mm"},
        "subtotal": 17600
      }
    ]
  },
  "message": "注文を作成しました"
}
```

### GET /api/orders/{id}

```json
{
  "order": {
    "id": 1,
    "order_number": "ACQ-260104-001",
    "status": "pending",
    "shipping_address_id": 9,
    "subtotal": 17600,
    "shipping_fee": 0,
    "tax": 1760,
    "total": 19360,
    "payment_method": "stripe",
    "cancel_reason": null,
    "items": [...]
  }
}
```

### POST /api/orders/{id}/cancel

```json
{
  "order": {
    "id": 1,
    "order_number": "ACQ-260104-001",
    "status": "cancelled",
    "cancelled_at": "2026-01-04T01:50:12.725808"
  },
  "message": "注文をキャンセルしました"
}
```

---

## 機能詳細

### 注文作成

2つの方法で注文を作成可能:

1. **カートから作成**: `items`を指定しない場合、カートの内容から注文を作成。注文作成後はカートを自動で空にする。
2. **明細を直接指定**: `items`配列で商品を直接指定。カートは変更されない。

### 注文番号

`ACQ-YYMMDD-XXX`形式で自動生成。
- 例: `ACQ-260104-001`（2026年1月4日の1件目）

### 注文ステータス

```
pending → awaiting_payment → paid → awaiting_data → data_reviewing → confirmed → processing → shipped → delivered
                                                                                                        ↘ cancelled
```

### キャンセル可能条件

以下のステータスの注文のみキャンセル可能:
- `pending`
- `awaiting_payment`
- `paid`

### 税計算

- 消費税率: 10%
- 計算式: `tax = subtotal * 0.10`（小数点以下切り捨て）

### オプション価格差分

注文作成時、オプションに`price_diff`が含まれる場合、基本価格に加算:

```json
{
  "size": {
    "label": "80mm角",
    "price_diff": 2000
  }
}
```

---

## テスト結果

| Endpoint | Method | Status | 結果 |
|----------|--------|--------|------|
| /api/orders | GET | 200 | 成功 |
| /api/orders | POST | 201 | 成功（明細指定） |
| /api/orders | POST | 201 | 成功（カートから作成） |
| /api/orders/{id} | GET | 200 | 成功 |
| /api/orders/{id}/cancel | POST | 200 | 成功 |

---

## マイグレーション

```bash
# 実行済み
docker exec acrique-v1-backend-1 alembic revision --autogenerate -m "add_orders_and_order_items_tables"
docker exec acrique-v1-backend-1 alembic upgrade head
```

マイグレーションファイル: `alembic/versions/9de943b16941_add_orders_and_order_items_tables.py`

---

## セキュリティ考慮事項

1. **認証必須** - すべてのエンドポイントで `get_current_user_from_cookie` による認証チェック
2. **アクセス制御** - 注文の取得/キャンセル時に `user_id` のチェックで他ユーザーへのアクセスを防止
3. **配送先確認** - 注文作成時に配送先の所有権を確認
4. **商品存在確認** - 注文作成時に商品の存在と公開状態を確認
5. **キャンセル権限** - 特定ステータスの注文のみキャンセル可能

---

## リファクタリング履歴

### 2026-01-04: ドメイン例外の導入

オニオンアーキテクチャの原則に従い、Application層から`fastapi.HTTPException`への依存を除去。

**変更内容:**
- `app/domain/exceptions/order.py` を新設:
  - `OrderNotFoundError` - 注文が見つからない
  - `OrderCannotCancelError` - 注文をキャンセルできない
- `app/domain/exceptions/cart.py` を使用:
  - `CartEmptyError` - カートが空
  - `NoAvailableProductsError` - 購入可能な商品がない
- `app/domain/exceptions/address.py` を使用:
  - `AddressNotFoundError` - 配送先が見つからない
- `app/domain/exceptions/product.py` を使用:
  - `ProductNotFoundError` - 商品が見つからない
  - `ProductNotActiveError` - 商品が非公開
- `app/domain/exceptions/common.py` を使用:
  - `PermissionDeniedError` - 権限がない
- `app/presentation/exception_handlers.py` で例外→HTTPレスポンス変換

**効果:**
- Application層がPresentation層の詳細（FastAPI）に依存しなくなった
- エラーコードの一元管理が可能に

---

## 次のステップ

1. **フロントエンド連携** - マイページ/注文履歴/チェックアウト画面との接続
2. **決済機能連携** - Stripe連携による決済フロー実装
3. **Admin API実装** - 管理者向け注文管理機能
4. **メール通知** - 注文確認メール、発送通知メールの実装
