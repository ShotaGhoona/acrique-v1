# Auth Backend 実装レポート

## 概要

ユーザー認証関連のバックエンドAPIを実装。オニオンアーキテクチャに従い、会員登録からパスワードリセットまでの一連の認証フローを構築した。

---

## 実装したAPI

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/auth/register` | 会員登録 |
| POST | `/api/auth/login` | ログイン |
| POST | `/api/auth/logout` | ログアウト |
| GET | `/api/auth/status` | 認証状態確認 |
| POST | `/api/auth/verify-email` | メール認証 |
| POST | `/api/auth/password-reset` | パスワードリセット依頼 |
| POST | `/api/auth/password-reset/confirm` | パスワード再設定 |
| POST | `/api/auth/resend-verification` | 認証メール再送信 |

---

## アーキテクチャ

### Domain層

**エンティティ:**

| ファイル | 説明 |
|----------|------|
| `app/domain/entities/user.py` | ユーザーエンティティ（DB設計準拠） |
| `app/domain/entities/verification_token.py` | 認証トークンエンティティ |

**リポジトリインターフェース:**

| ファイル | 説明 |
|----------|------|
| `app/domain/repositories/user_repository.py` | ユーザーリポジトリIF |
| `app/domain/repositories/verification_token_repository.py` | トークンリポジトリIF |

### Application層

**UseCase:**

| ファイル | 説明 |
|----------|------|
| `app/application/use_cases/auth_usecase.py` | 認証ユースケース（全機能） |

**スキーマ（DTO）:**

| ファイル | 説明 |
|----------|------|
| `app/application/schemas/auth_schemas.py` | 入出力DTO |

**インターフェース:**

| ファイル | 説明 |
|----------|------|
| `app/application/interfaces/security_service.py` | セキュリティサービスIF |
| `app/application/interfaces/email_service.py` | メールサービスIF |

### Infrastructure層

**DBモデル:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/models/user_model.py` | usersテーブル |
| `app/infrastructure/db/models/verification_token_model.py` | verification_tokensテーブル |

**リポジトリ実装:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/repositories/user_repository_impl.py` | ユーザーリポジトリ実装 |
| `app/infrastructure/db/repositories/verification_token_repository_impl.py` | トークンリポジトリ実装 |

**外部サービス:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/security/security_service_impl.py` | JWT・パスワードハッシュ |
| `app/infrastructure/email/resend_email_service.py` | Resendメール送信 |

### Presentation層

| ファイル | 説明 |
|----------|------|
| `app/presentation/api/auth_api.py` | APIエンドポイント |
| `app/presentation/schemas/auth_schemas.py` | リクエスト/レスポンススキーマ |

### DI層

| ファイル | 説明 |
|----------|------|
| `app/di/auth.py` | 依存性注入設定 |

---

## DBスキーマ

### users テーブル

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    name_kana VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(200),
    stripe_customer_id VARCHAR(255),
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### verification_tokens テーブル

```sql
CREATE TABLE verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_type VARCHAR(50) NOT NULL,  -- email_verification / password_reset
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 認証フロー

### 会員登録フロー

```
1. POST /api/auth/register
   ↓
2. パスワードハッシュ化（bcrypt）
   ↓
3. ユーザー作成
   ↓
4. 認証トークン生成（24時間有効）
   ↓
5. 認証メール送信（Resend）
   ↓
6. レスポンス返却
```

### ログインフロー

```
1. POST /api/auth/login
   ↓
2. メールアドレスでユーザー検索
   ↓
3. パスワード検証
   ↓
4. メール認証済みチェック（必須）
   ↓
5. JWTトークン生成（RS256）
   ↓
6. Cookieにトークン設定（httponly, secure）
```

### パスワードリセットフロー

```
1. POST /api/auth/password-reset
   ↓
2. ユーザー存在チェック（存在しなくても成功応答 = セキュリティ対策）
   ↓
3. リセットトークン生成（1時間有効）
   ↓
4. リセットメール送信
   ↓
5. POST /api/auth/password-reset/confirm
   ↓
6. トークン検証
   ↓
7. パスワード更新
```

---

## セキュリティ対策

| 項目 | 対策 |
|------|------|
| パスワード | bcryptでハッシュ化、最小8文字 |
| JWT | RS256（公開鍵暗号）、7日間有効 |
| Cookie | httponly, secure, samesite=lax |
| メール認証 | ログイン前に必須 |
| トークン | secrets.token_urlsafe(32)で生成 |
| 列挙攻撃対策 | パスワードリセットは常に成功応答 |

---

## 環境変数

```env
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=ACRIQUE <noreply@acrique.jp>

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

---

## 依存パッケージ

```
resend==2.5.0
```

---

## リファクタリング履歴

### 2026-01-04: ドメイン例外の導入

オニオンアーキテクチャの原則に従い、Application層から`fastapi.HTTPException`への依存を除去。

**変更内容:**
- `app/domain/exceptions/` ディレクトリを新設
- 認証関連のドメイン例外を定義（`auth.py`）:
  - `EmailAlreadyExistsError` - メールアドレス重複
  - `InvalidCredentialsError` - 認証失敗
  - `EmailNotVerifiedError` - メール未認証
  - `InvalidTokenError` - トークン無効
  - `EmailAlreadyVerifiedError` - 既に認証済み
- `UserNotFoundError`（`user.py`）
- `app/presentation/exception_handlers.py` で例外→HTTPレスポンス変換

**効果:**
- Application層がPresentation層の詳細（FastAPI）に依存しなくなった
- エラーコードの一元管理が可能に
- テスト時にHTTP層をモックする必要がなくなった

---

## 次のステップ

1. **マイグレーション実行**
   ```bash
   make db-migrate msg='add users and verification_tokens tables'
   make db-upgrade
   ```

2. **Resend設定**
   - Resendでドメイン認証
   - APIキー取得して.envに設定

3. **フロントエンド連携**
   - `/verify-email?token=xxx` ページ実装
   - `/password-reset/confirm?token=xxx` ページ実装
