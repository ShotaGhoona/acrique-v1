# ユーザーAPI仕様書

## 概要

ユーザー情報関連のAPIエンドポイント仕様です。
Base URL: `/api/v1/users`

---

## エンドポイント一覧

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | `/me` | 自分の情報取得 | 必要 |
| PUT | `/me` | 自分の情報更新 | 必要 |
| PUT | `/me/password` | パスワード変更 | 必要 |

---

## 1. 自分の情報取得

### `GET /users/me`

ログイン中のユーザー自身の情報を取得します。

#### リクエスト

リクエストボディなし（Cookieの`access_token`で認証）

#### レスポンス

**成功時 (200 OK)**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "山田 太郎",
  "name_kana": "ヤマダ タロウ",
  "phone": "090-1234-5678",
  "company": "株式会社サンプル",
  "is_email_verified": true,
  "created_at": "2025-01-04T12:00:00.000Z"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | number | ユーザーID |
| email | string | メールアドレス |
| name | string \| null | 氏名 |
| name_kana | string \| null | フリガナ |
| phone | string \| null | 電話番号 |
| company | string \| null | 会社名 |
| is_email_verified | boolean | メール認証済みかどうか |
| created_at | string (ISO 8601) \| null | 作成日時 |

---

## 2. 自分の情報更新

### `PUT /users/me`

ログイン中のユーザー自身の情報を更新します。

#### リクエスト

```json
{
  "name": "山田 太郎",
  "name_kana": "ヤマダ タロウ",
  "phone": "090-1234-5678",
  "company": "株式会社サンプル"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| name | string | - | 氏名 |
| name_kana | string | - | フリガナ |
| phone | string | - | 電話番号 |
| company | string | - | 会社名 |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "山田 太郎",
  "name_kana": "ヤマダ タロウ",
  "phone": "090-1234-5678",
  "company": "株式会社サンプル",
  "message": "プロフィールを更新しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | number | ユーザーID |
| email | string | メールアドレス |
| name | string \| null | 氏名 |
| name_kana | string \| null | フリガナ |
| phone | string \| null | 電話番号 |
| company | string \| null | 会社名 |
| message | string | メッセージ |

---

## 3. パスワード変更

### `PUT /users/me/password`

ログイン中のユーザーのパスワードを変更します。

#### リクエスト

```json
{
  "current_password": "currentpassword123",
  "new_password": "newpassword456"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| current_password | string | ○ | 現在のパスワード |
| new_password | string | ○ | 新しいパスワード（8文字以上） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "パスワードを変更しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
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
| 404 | ユーザーが見つからない |
| 422 | バリデーションエラー（Pydantic） |
| 500 | サーバーエラー |

---

## 関連ファイル

### バックエンド

- `backend/app/presentation/api/user_api.py` - APIエンドポイント定義
- `backend/app/presentation/schemas/user_schemas.py` - リクエスト/レスポンススキーマ
- `backend/app/application/use_cases/user_usecase.py` - ユースケース実装
- `backend/app/application/schemas/user_schemas.py` - アプリケーション層DTO
