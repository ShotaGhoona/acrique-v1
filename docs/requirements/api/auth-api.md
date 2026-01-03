# 認証API仕様書

## 概要

認証関連のAPIエンドポイント仕様です。
Base URL: `/api/v1/auth`

---

## エンドポイント一覧

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| POST | `/register` | 会員登録 | 不要 |
| POST | `/login` | ログイン | 不要 |
| POST | `/logout` | ログアウト | 必要 |
| GET | `/status` | 認証状態取得 | 必要 |
| POST | `/verify-email` | メール認証 | 不要 |
| POST | `/password-reset` | パスワードリセット依頼 | 不要 |
| POST | `/password-reset/confirm` | パスワードリセット実行 | 不要 |
| POST | `/resend-verification` | メール認証再送信 | 不要 |

---

## 1. 会員登録

### `POST /auth/register`

新規ユーザーを登録します。登録後、メール認証用のリンクがメールで送信されます。

#### リクエスト

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "山田 太郎",
  "name_kana": "ヤマダ タロウ",
  "phone": "090-1234-5678",
  "company": "株式会社サンプル"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| email | string | ○ | メールアドレス |
| password | string | ○ | パスワード（8文字以上） |
| name | string | - | 氏名 |
| name_kana | string | - | フリガナ |
| phone | string | - | 電話番号 |
| company | string | - | 会社名 |

#### レスポンス

**成功時 (201 Created)**

```json
{
  "user_id": 1,
  "email": "user@example.com",
  "message": "会員登録が完了しました。メールをご確認ください。"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| user_id | number | ユーザーID |
| email | string | 登録されたメールアドレス |
| message | string | メッセージ |

---

## 2. ログイン

### `POST /auth/login`

メールアドレスとパスワードでログインします。成功時、アクセストークンがCookieに設定されます。

#### リクエスト

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| email | string | ○ | メールアドレス |
| password | string | ○ | パスワード |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "ログイン成功",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 1
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| message | string | メッセージ |
| access_token | string | アクセストークン（JWT） |
| user_id | number | ユーザーID |

**Cookie設定**

| Cookie名 | 値 | 属性 |
|----------|------|------|
| access_token | JWTトークン | httpOnly=true, secure=true, sameSite=lax, maxAge=7日 |

---

## 3. ログアウト

### `POST /auth/logout`

ログアウトします。Cookieからアクセストークンが削除されます。

#### リクエスト

リクエストボディなし（Cookieの`access_token`で認証）

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "ログアウトしました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| message | string | メッセージ |

---

## 4. 認証状態取得

### `GET /auth/status`

現在のログインユーザーの認証状態を取得します。

#### リクエスト

リクエストボディなし（Cookieの`access_token`で認証）

#### レスポンス

**成功時 (200 OK)**

```json
{
  "is_authenticated": true,
  "user_id": 1,
  "email": "user@example.com",
  "name": "山田 太郎",
  "is_email_verified": true
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| is_authenticated | boolean | 認証済みかどうか |
| user_id | number | ユーザーID |
| email | string | メールアドレス |
| name | string \| null | 氏名（未設定の場合null） |
| is_email_verified | boolean | メール認証済みかどうか |

---

## 5. メール認証

### `POST /auth/verify-email`

メールで送信されたトークンを使ってメールアドレスを認証します。

#### リクエスト

```json
{
  "token": "abc123def456..."
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| token | string | ○ | メールで送信された認証トークン |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "メール認証が完了しました",
  "verified_at": "2025-01-04T12:00:00.000Z"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| message | string | メッセージ |
| verified_at | string (ISO 8601) | 認証日時 |

---

## 6. パスワードリセット依頼

### `POST /auth/password-reset`

パスワードリセット用のメールを送信します。

#### リクエスト

```json
{
  "email": "user@example.com"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| email | string | ○ | 登録済みメールアドレス |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "パスワードリセット用のメールを送信しました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| message | string | メッセージ |

> **注意**: セキュリティ上、メールアドレスが登録されていない場合も同じレスポンスを返します。

---

## 7. パスワードリセット実行

### `POST /auth/password-reset/confirm`

トークンを使って新しいパスワードを設定します。

#### リクエスト

```json
{
  "token": "xyz789...",
  "new_password": "newpassword123"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| token | string | ○ | パスワードリセットトークン |
| new_password | string | ○ | 新しいパスワード（8文字以上） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "パスワードが更新されました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| message | string | メッセージ |

---

## 8. メール認証再送信

### `POST /auth/resend-verification`

メール認証用のメールを再送信します。

#### リクエスト

```json
{
  "email": "user@example.com"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| email | string | ○ | 登録済みメールアドレス |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "認証メールを再送信しました"
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
| 404 | リソースが見つからない |
| 422 | バリデーションエラー（Pydantic） |
| 500 | サーバーエラー |

---

## フロントエンド実装

### API呼び出し

`frontend/src/entities/auth/api/auth-api.ts` にAPI呼び出し関数が定義されています。

```typescript
import { authApi } from '@/entities/auth/api/auth-api';

// 会員登録
await authApi.register({ email, password, name, ... });

// ログイン
await authApi.login({ email, password });

// ログアウト
await authApi.logout();

// 認証状態取得
await authApi.getAuthStatus();

// メール認証
await authApi.verifyEmail({ token });

// パスワードリセット依頼
await authApi.requestPasswordReset({ email });

// パスワードリセット実行
await authApi.confirmPasswordReset({ token, new_password });

// メール認証再送信
await authApi.resendVerification({ email });
```

### 型定義

`frontend/src/entities/auth/model/types.ts` に型定義があります。

---

## 関連ファイル

### バックエンド

- `backend/app/presentation/api/auth_api.py` - APIエンドポイント定義
- `backend/app/presentation/schemas/auth_schemas.py` - リクエスト/レスポンススキーマ
- `backend/app/application/use_cases/auth_usecase.py` - ユースケース実装
- `backend/app/application/schemas/auth_schemas.py` - アプリケーション層DTO

### フロントエンド

- `frontend/src/entities/auth/api/auth-api.ts` - API呼び出し関数
- `frontend/src/entities/auth/model/types.ts` - 型定義
- `frontend/src/features/auth/register/` - 会員登録機能
- `frontend/src/features/auth/password-reset/` - パスワードリセット機能
- `frontend/src/features/auth/verify-email/` - メール認証機能
