# カートAPI仕様書

## 概要

ショッピングカート関連のAPIエンドポイント仕様です。
Base URL: `/api/v1/cart`

---

## エンドポイント一覧

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | `/` | カート内容取得 | 必要 |
| POST | `/items` | カートに商品追加 | 必要 |
| PUT | `/items/{item_id}` | カートアイテム更新 | 必要 |
| DELETE | `/items/{item_id}` | カートアイテム削除 | 必要 |
| DELETE | `/` | カート全削除 | 必要 |

---

## 1. カート内容取得

### `GET /cart`

ログイン中のユーザーのカート内容を取得します。

#### リクエスト

リクエストボディなし（Cookieの`access_token`で認証）

#### レスポンス

**成功時 (200 OK)**

```json
{
  "items": [
    {
      "id": 1,
      "product_id": "PROD-001",
      "product_name": "Sample Product",
      "product_name_ja": "サンプル商品",
      "product_image_url": "https://example.com/images/product.jpg",
      "base_price": 1000,
      "quantity": 2,
      "options": {
        "color": {
          "value": "red",
          "label": "レッド",
          "price_diff": 100
        },
        "size": {
          "value": "L",
          "label": "Lサイズ",
          "price_diff": 0
        }
      },
      "subtotal": 2200,
      "created_at": "2025-01-04T12:00:00.000Z",
      "updated_at": "2025-01-04T12:00:00.000Z"
    }
  ],
  "item_count": 1,
  "total_quantity": 2,
  "subtotal": 2200,
  "tax": 220,
  "total": 2420
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| items | array | カートアイテム一覧 |
| items[].id | number | カートアイテムID |
| items[].product_id | string | 商品ID |
| items[].product_name | string \| null | 商品名（英語） |
| items[].product_name_ja | string \| null | 商品名（日本語） |
| items[].product_image_url | string \| null | 商品画像URL |
| items[].base_price | number | 商品基本価格（税抜） |
| items[].quantity | number | 数量 |
| items[].options | object \| null | 選択オプション |
| items[].subtotal | number | 小計（オプション価格差分込み） |
| items[].created_at | string (ISO 8601) \| null | 作成日時 |
| items[].updated_at | string (ISO 8601) \| null | 更新日時 |
| item_count | number | アイテム数（商品種類数） |
| total_quantity | number | 合計数量 |
| subtotal | number | 小計（税抜） |
| tax | number | 消費税 |
| total | number | 合計（税込） |

---

## 2. カートに商品追加

### `POST /cart/items`

カートに商品を追加します。同一商品・同一オプションの場合は数量が加算されます。

#### リクエスト

```json
{
  "product_id": "PROD-001",
  "quantity": 1,
  "options": {
    "color": {
      "value": "red",
      "label": "レッド",
      "price_diff": 100
    },
    "size": {
      "value": "L",
      "label": "Lサイズ",
      "price_diff": 0
    }
  }
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| product_id | string | ○ | 商品ID |
| quantity | number | - | 数量（デフォルト: 1、1以上） |
| options | object | - | 選択オプション |

#### レスポンス

**成功時 (201 Created)**

```json
{
  "item": {
    "id": 1,
    "product_id": "PROD-001",
    "product_name": "Sample Product",
    "product_name_ja": "サンプル商品",
    "product_image_url": "https://example.com/images/product.jpg",
    "base_price": 1000,
    "quantity": 1,
    "options": {
      "color": {
        "value": "red",
        "label": "レッド",
        "price_diff": 100
      }
    },
    "subtotal": 1100,
    "created_at": "2025-01-04T12:00:00.000Z",
    "updated_at": "2025-01-04T12:00:00.000Z"
  },
  "message": "カートに追加しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| item | object | 追加されたカートアイテム |
| message | string | メッセージ |

---

## 3. カートアイテム更新

### `PUT /cart/items/{item_id}`

カート内の指定アイテムの数量やオプションを更新します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| item_id | number | ○ | カートアイテムID（パスパラメータ） |

```json
{
  "quantity": 3,
  "options": {
    "color": {
      "value": "blue",
      "label": "ブルー",
      "price_diff": 0
    }
  }
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| quantity | number | - | 数量（1以上） |
| options | object | - | 選択オプション |

> **注意**: 更新したいフィールドのみを送信できます。送信されなかったフィールドは変更されません。

#### レスポンス

**成功時 (200 OK)**

```json
{
  "item": {
    "id": 1,
    "product_id": "PROD-001",
    "product_name": "Sample Product",
    "product_name_ja": "サンプル商品",
    "product_image_url": "https://example.com/images/product.jpg",
    "base_price": 1000,
    "quantity": 3,
    "options": {
      "color": {
        "value": "blue",
        "label": "ブルー",
        "price_diff": 0
      }
    },
    "subtotal": 3000,
    "created_at": "2025-01-04T12:00:00.000Z",
    "updated_at": "2025-01-04T13:00:00.000Z"
  },
  "message": "カートを更新しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| item | object | 更新されたカートアイテム |
| message | string | メッセージ |

---

## 4. カートアイテム削除

### `DELETE /cart/items/{item_id}`

カートから指定アイテムを削除します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| item_id | number | ○ | カートアイテムID（パスパラメータ） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "カートから削除しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| message | string | メッセージ |

---

## 5. カート全削除

### `DELETE /cart`

カート内のすべてのアイテムを削除します。

#### リクエスト

リクエストボディなし

#### レスポンス

**成功時 (200 OK)**

```json
{
  "deleted_count": 3,
  "message": "カートを空にしました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| deleted_count | number | 削除されたアイテム数 |
| message | string | メッセージ |

---

## オプションデータ形式

カートアイテムのオプションは以下の形式で保存されます。

```json
{
  "オプション種別": {
    "value": "選択値",
    "label": "表示ラベル",
    "price_diff": 価格差分
  }
}
```

### 例

```json
{
  "color": {
    "value": "red",
    "label": "レッド",
    "price_diff": 100
  },
  "size": {
    "value": "L",
    "label": "Lサイズ",
    "price_diff": 0
  },
  "material": {
    "value": "leather",
    "label": "本革",
    "price_diff": 500
  }
}
```

> **注意**: `price_diff`はオプション選択による価格加算額です。小計計算時に基本価格に加算されます。

---

## 価格計算ロジック

```
アイテム小計 = (基本価格 + オプション価格差分の合計) × 数量
カート小計 = 全アイテムの小計の合計
消費税 = カート小計 × 0.1（10%、切り捨て）
カート合計 = カート小計 + 消費税
```

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
| 400 | リクエスト不正（バリデーションエラー等） |
| 401 | 認証エラー（未ログイン、トークン無効等） |
| 403 | 権限エラー（他ユーザーのカートへのアクセス） |
| 404 | カートアイテムが見つからない / 商品が見つからない |
| 422 | バリデーションエラー（Pydantic） |
| 500 | サーバーエラー |

---

## 関連ファイル

### バックエンド

- `backend/app/presentation/api/cart_api.py` - APIエンドポイント定義
- `backend/app/presentation/schemas/cart_schemas.py` - リクエスト/レスポンススキーマ
- `backend/app/application/use_cases/cart_usecase.py` - ユースケース実装
- `backend/app/application/schemas/cart_schemas.py` - アプリケーション層DTO
- `backend/app/domain/entities/cart_item.py` - ドメインエンティティ
- `backend/app/domain/repositories/cart_item_repository.py` - リポジトリインターフェース
- `backend/app/infrastructure/db/repositories/cart_item_repository_impl.py` - リポジトリ実装
- `backend/app/infrastructure/db/models/cart_item_model.py` - DBモデル
- `backend/app/di/cart.py` - 依存性注入設定
