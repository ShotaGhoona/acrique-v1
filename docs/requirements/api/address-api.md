# 配送先API仕様書

## 概要

配送先（住所）関連のAPIエンドポイント仕様です。
Base URL: `/api/v1/addresses`

---

## エンドポイント一覧

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | `/` | 配送先一覧取得 | 必要 |
| POST | `/` | 配送先追加 | 必要 |
| GET | `/{address_id}` | 配送先詳細取得 | 必要 |
| PUT | `/{address_id}` | 配送先更新 | 必要 |
| DELETE | `/{address_id}` | 配送先削除 | 必要 |
| PUT | `/{address_id}/default` | デフォルト配送先設定 | 必要 |

---

## 1. 配送先一覧取得

### `GET /addresses`

ログイン中のユーザーの配送先一覧を取得します。

#### リクエスト

リクエストボディなし（Cookieの`access_token`で認証）

#### レスポンス

**成功時 (200 OK)**

```json
{
  "addresses": [
    {
      "id": 1,
      "label": "自宅",
      "name": "山田 太郎",
      "postal_code": "150-0001",
      "prefecture": "東京都",
      "city": "渋谷区",
      "address1": "神宮前1-2-3",
      "address2": "サンプルマンション 101号室",
      "phone": "090-1234-5678",
      "is_default": true,
      "created_at": "2025-01-04T12:00:00.000Z"
    }
  ],
  "total": 1
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| addresses | array | 配送先一覧 |
| addresses[].id | number | 配送先ID |
| addresses[].label | string \| null | ラベル（自宅/会社等） |
| addresses[].name | string | 宛名 |
| addresses[].postal_code | string | 郵便番号 |
| addresses[].prefecture | string | 都道府県 |
| addresses[].city | string | 市区町村 |
| addresses[].address1 | string | 住所1（町名・番地） |
| addresses[].address2 | string \| null | 住所2（建物名・部屋番号） |
| addresses[].phone | string | 電話番号 |
| addresses[].is_default | boolean | デフォルト配送先かどうか |
| addresses[].created_at | string (ISO 8601) \| null | 作成日時 |
| total | number | 総件数 |

---

## 2. 配送先追加

### `POST /addresses`

新しい配送先を追加します。

#### リクエスト

```json
{
  "label": "自宅",
  "name": "山田 太郎",
  "postal_code": "150-0001",
  "prefecture": "東京都",
  "city": "渋谷区",
  "address1": "神宮前1-2-3",
  "address2": "サンプルマンション 101号室",
  "phone": "090-1234-5678",
  "is_default": true
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| label | string | - | ラベル（自宅/会社等） |
| name | string | ○ | 宛名 |
| postal_code | string | ○ | 郵便番号 |
| prefecture | string | ○ | 都道府県 |
| city | string | ○ | 市区町村 |
| address1 | string | ○ | 住所1（町名・番地） |
| address2 | string | - | 住所2（建物名・部屋番号） |
| phone | string | ○ | 電話番号 |
| is_default | boolean | - | デフォルト配送先に設定するか（デフォルト: false） |

#### レスポンス

**成功時 (201 Created)**

```json
{
  "address": {
    "id": 1,
    "label": "自宅",
    "name": "山田 太郎",
    "postal_code": "150-0001",
    "prefecture": "東京都",
    "city": "渋谷区",
    "address1": "神宮前1-2-3",
    "address2": "サンプルマンション 101号室",
    "phone": "090-1234-5678",
    "is_default": true,
    "created_at": "2025-01-04T12:00:00.000Z"
  },
  "message": "配送先を追加しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| address | object | 作成された配送先 |
| message | string | メッセージ |

---

## 3. 配送先詳細取得

### `GET /addresses/{address_id}`

指定した配送先の詳細を取得します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| address_id | number | ○ | 配送先ID（パスパラメータ） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "address": {
    "id": 1,
    "label": "自宅",
    "name": "山田 太郎",
    "postal_code": "150-0001",
    "prefecture": "東京都",
    "city": "渋谷区",
    "address1": "神宮前1-2-3",
    "address2": "サンプルマンション 101号室",
    "phone": "090-1234-5678",
    "is_default": true,
    "created_at": "2025-01-04T12:00:00.000Z"
  }
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| address | object | 配送先 |

---

## 4. 配送先更新

### `PUT /addresses/{address_id}`

指定した配送先を更新します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| address_id | number | ○ | 配送先ID（パスパラメータ） |

```json
{
  "label": "会社",
  "name": "山田 太郎",
  "postal_code": "100-0001",
  "prefecture": "東京都",
  "city": "千代田区",
  "address1": "丸の内1-2-3",
  "address2": "サンプルビル 5F",
  "phone": "03-1234-5678"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| label | string | - | ラベル（自宅/会社等） |
| name | string | - | 宛名 |
| postal_code | string | - | 郵便番号 |
| prefecture | string | - | 都道府県 |
| city | string | - | 市区町村 |
| address1 | string | - | 住所1（町名・番地） |
| address2 | string | - | 住所2（建物名・部屋番号） |
| phone | string | - | 電話番号 |

> **注意**: 更新したいフィールドのみを送信できます。送信されなかったフィールドは変更されません。

#### レスポンス

**成功時 (200 OK)**

```json
{
  "address": {
    "id": 1,
    "label": "会社",
    "name": "山田 太郎",
    "postal_code": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "address1": "丸の内1-2-3",
    "address2": "サンプルビル 5F",
    "phone": "03-1234-5678",
    "is_default": true,
    "created_at": "2025-01-04T12:00:00.000Z"
  },
  "message": "配送先を更新しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| address | object | 更新された配送先 |
| message | string | メッセージ |

---

## 5. 配送先削除

### `DELETE /addresses/{address_id}`

指定した配送先を削除します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| address_id | number | ○ | 配送先ID（パスパラメータ） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "配送先を削除しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| message | string | メッセージ |

---

## 6. デフォルト配送先設定

### `PUT /addresses/{address_id}/default`

指定した配送先をデフォルトに設定します。既存のデフォルト配送先は解除されます。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| address_id | number | ○ | 配送先ID（パスパラメータ） |

リクエストボディなし

#### レスポンス

**成功時 (200 OK)**

```json
{
  "address": {
    "id": 1,
    "label": "自宅",
    "name": "山田 太郎",
    "postal_code": "150-0001",
    "prefecture": "東京都",
    "city": "渋谷区",
    "address1": "神宮前1-2-3",
    "address2": "サンプルマンション 101号室",
    "phone": "090-1234-5678",
    "is_default": true,
    "created_at": "2025-01-04T12:00:00.000Z"
  },
  "message": "デフォルト配送先を設定しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| address | object | デフォルトに設定された配送先 |
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
| 400 | リクエスト不正（バリデーションエラー等） |
| 401 | 認証エラー（未ログイン、トークン無効等） |
| 403 | 権限エラー（他ユーザーの配送先へのアクセス） |
| 404 | 配送先が見つからない |
| 422 | バリデーションエラー（Pydantic） |
| 500 | サーバーエラー |

---

## 関連ファイル

### バックエンド

- `backend/app/presentation/api/address_api.py` - APIエンドポイント定義
- `backend/app/presentation/schemas/address_schemas.py` - リクエスト/レスポンススキーマ
- `backend/app/application/use_cases/address_usecase.py` - ユースケース実装
- `backend/app/application/schemas/address_schemas.py` - アプリケーション層DTO
- `backend/app/domain/entities/address.py` - ドメインエンティティ
- `backend/app/domain/repositories/address_repository.py` - リポジトリインターフェース
- `backend/app/infrastructure/db/repositories/address_repository_impl.py` - リポジトリ実装
- `backend/app/infrastructure/db/models/address_model.py` - DBモデル
