# Cart Backend 実装レポート

## 概要

カート管理のバックエンドAPIを実装。オニオンアーキテクチャに従い、カート取得・追加・更新・削除・全削除機能を構築した。

---

## 実装したAPI

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/cart` | カート内容取得 |
| POST | `/api/cart/items` | カートに追加 |
| PUT | `/api/cart/items/{id}` | カート商品更新（数量等） |
| DELETE | `/api/cart/items/{id}` | カートから削除 |
| DELETE | `/api/cart` | カートを空にする |

---

## アーキテクチャ

### Domain層

**エンティティ:**

| ファイル | 説明 |
|----------|------|
| `app/domain/entities/cart_item.py` | CartItem（新規） |

**リポジトリインターフェース:**

| ファイル | 説明 |
|----------|------|
| `app/domain/repositories/cart_item_repository.py` | カートアイテムリポジトリIF（新規） |

### Application層

**UseCase:**

| ファイル | 説明 |
|----------|------|
| `app/application/use_cases/cart_usecase.py` | カートユースケース（新規） |

**スキーマ（DTO）:**

| ファイル | 説明 |
|----------|------|
| `app/application/schemas/cart_schemas.py` | カート入出力DTO（新規） |

### Infrastructure層

**DBモデル:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/models/cart_item_model.py` | CartItemModel（新規） |

**リポジトリ実装:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/repositories/cart_item_repository_impl.py` | カートアイテムリポジトリ実装（新規） |

### Presentation層

| ファイル | 説明 |
|----------|------|
| `app/presentation/api/cart_api.py` | カートAPIエンドポイント（新規） |
| `app/presentation/schemas/cart_schemas.py` | カートリクエスト/レスポンススキーマ（新規） |

### DI層

| ファイル | 説明 |
|----------|------|
| `app/di/cart.py` | カート依存性注入設定（新規） |

---

## DBスキーマ

### cart_items テーブル

```sql
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    quantity INT NOT NULL DEFAULT 1,
    options JSONB,  -- 選択オプション
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_cart_items_user_id ON cart_items(user_id);
CREATE INDEX ix_cart_items_product_id ON cart_items(product_id);
```

---

## APIレスポンス例

### GET /api/cart

```json
{
  "items": [
    {
      "id": 1,
      "product_id": "qr-cube",
      "product_name": "QR Code Cube",
      "product_name_ja": "QRコードキューブ",
      "product_image_url": "/images/products/qr-cube-1.jpg",
      "base_price": 8800,
      "quantity": 2,
      "options": {
        "size": "50mm"
      },
      "subtotal": 17600,
      "created_at": "2026-01-04T01:29:29.931469",
      "updated_at": "2026-01-04T01:29:29.931469"
    }
  ],
  "item_count": 1,
  "total_quantity": 2,
  "subtotal": 17600,
  "tax": 1760,
  "total": 19360
}
```

### POST /api/cart/items

```json
{
  "item": {
    "id": 1,
    "product_id": "qr-cube",
    "product_name": "QR Code Cube",
    "product_name_ja": "QRコードキューブ",
    "product_image_url": "/images/products/qr-cube-1.jpg",
    "base_price": 8800,
    "quantity": 2,
    "options": {
      "size": "50mm"
    },
    "subtotal": 17600,
    "created_at": "2026-01-04T01:29:29.931469",
    "updated_at": "2026-01-04T01:29:29.931469"
  },
  "message": "カートに追加しました"
}
```

### PUT /api/cart/items/{id}

```json
{
  "item": {
    "id": 1,
    "product_id": "qr-cube",
    "product_name": "QR Code Cube",
    "product_name_ja": "QRコードキューブ",
    "product_image_url": "/images/products/qr-cube-1.jpg",
    "base_price": 8800,
    "quantity": 5,
    "options": {
      "size": "50mm"
    },
    "subtotal": 44000,
    "created_at": "2026-01-04T01:29:29.931469",
    "updated_at": "2026-01-04T01:29:40.197085"
  },
  "message": "カートを更新しました"
}
```

### DELETE /api/cart/items/{id}

```json
{
  "message": "カートから削除しました"
}
```

### DELETE /api/cart

```json
{
  "deleted_count": 1,
  "message": "1件のアイテムを削除しました"
}
```

---

## 機能詳細

### 同一商品の重複追加

同じ商品をカートに追加する場合、既存アイテムの数量を加算する動作となる。

### 税計算

- 消費税率: 10%
- 計算式: `tax = subtotal * 0.10`
- 小数点以下切り捨て

### オプション価格差分

`options`フィールドに`price_diff`を持つオプション値がある場合、基本価格に加算される。

```python
# 例: サイズオプションで+2000円
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
| /api/cart | GET | 200 | 成功 |
| /api/cart/items | POST | 201 | 成功 |
| /api/cart/items/{id} | PUT | 200 | 成功 |
| /api/cart/items/{id} | DELETE | 200 | 成功 |
| /api/cart | DELETE | 200 | 成功 |

---

## マイグレーション

```bash
# 実行済み
docker exec acrique-v1-backend-1 alembic revision --autogenerate -m "add_cart_items_table"
docker exec acrique-v1-backend-1 alembic upgrade head
```

マイグレーションファイル: `alembic/versions/aa0d4272a011_add_cart_items_table.py`

---

## セキュリティ考慮事項

1. **認証必須** - すべてのエンドポイントで `get_current_user_from_cookie` による認証チェック
2. **アクセス制御** - カートアイテムの更新/削除時に `user_id` のチェックで他ユーザーへのアクセスを防止
3. **商品存在確認** - カート追加時に商品の存在と公開状態を確認
4. **削除済み商品** - カート取得時に削除された商品は自動的にカートから除去

---

## 次のステップ

1. **フロントエンド連携** - カートページ、カート追加機能との接続
2. **注文機能連携** - チェックアウト時にカートから注文を作成
3. **ゲストカート対応** - ログイン前のカート保持（LocalStorage + ログイン時マージ）
