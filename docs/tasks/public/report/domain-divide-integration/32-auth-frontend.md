# Auth Frontend 実装レポート

## 概要

ユーザー認証関連のフロントエンドページを実装。Feature-Sliced Design（FSD）に従い、会員登録からパスワードリセットまでの一連の認証UIを構築した。

---

## 実装したページ

| パス | ページ | 説明 |
|------|--------|------|
| `/register` | 会員登録 | メール・パスワード入力フォーム |
| `/register/complete` | 登録完了 | メール送信案内 |
| `/verify-email?token=xxx` | メール認証 | トークン検証・結果表示 |
| `/password-reset` | パスワードリセット依頼 | メールアドレス入力 |
| `/password-reset/confirm?token=xxx` | パスワード再設定 | 新パスワード入力 |

---

## アーキテクチャ

### entities/auth

**API:**

| ファイル | 説明 |
|----------|------|
| `entities/auth/api/auth-api.ts` | 認証API呼び出し |
| `entities/auth/model/types.ts` | 型定義 |

**追加したAPI関数:**

```typescript
register(data: RegisterRequest): Promise<RegisterResponse>
verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse>
requestPasswordReset(request: PasswordResetRequest): Promise<PasswordResetResponse>
confirmPasswordReset(request: PasswordResetConfirmRequest): Promise<PasswordResetConfirmResponse>
resendVerification(request: ResendVerificationRequest): Promise<ResendVerificationResponse>
```

### features/auth

| ディレクトリ | 説明 |
|--------------|------|
| `features/auth/register/` | 会員登録フック |
| `features/auth/verify-email/` | メール認証フック |
| `features/auth/password-reset/` | パスワードリセットフック |

**フック一覧:**

| フック | 用途 |
|--------|------|
| `useRegister()` | 会員登録mutation |
| `useVerifyEmail()` | メール認証mutation |
| `usePasswordResetRequest()` | リセット依頼mutation |
| `usePasswordResetConfirm()` | パスワード再設定mutation |

### page-components

| ディレクトリ | 説明 |
|--------------|------|
| `page-components/register/` | 会員登録ページ |
| `page-components/register-complete/` | 登録完了ページ |
| `page-components/verify-email/` | メール認証ページ |
| `page-components/password-reset/` | リセット依頼ページ |
| `page-components/password-reset-confirm/` | パスワード再設定ページ |

### app routes

| ファイル | ルート |
|----------|--------|
| `app/(public)/register/page.tsx` | `/register` |
| `app/(public)/register/complete/page.tsx` | `/register/complete` |
| `app/(public)/verify-email/page.tsx` | `/verify-email` |
| `app/(public)/password-reset/page.tsx` | `/password-reset` |
| `app/(public)/password-reset/confirm/page.tsx` | `/password-reset/confirm` |

---

## UI仕様

### 会員登録ページ (`/register`)

**入力項目:**
- メールアドレス（必須）
- パスワード（必須、8文字以上）
- パスワード確認（必須）

**フロー:**
```
入力 → バリデーション → API送信 → /register/complete へリダイレクト
```

### メール認証ページ (`/verify-email`)

**状態:**
- `isPending`: 認証中スピナー
- `isSuccess`: 認証完了メッセージ + ログインボタン
- `isError`: エラーメッセージ + ログインボタン
- `no token`: 無効なリンクエラー

### パスワードリセット依頼 (`/password-reset`)

**入力項目:**
- メールアドレス（必須）

**フロー:**
```
入力 → API送信 → 送信完了メッセージ表示
```

### パスワード再設定 (`/password-reset/confirm`)

**入力項目:**
- 新しいパスワード（必須、8文字以上）
- パスワード確認（必須）

**フロー:**
```
入力 → バリデーション → API送信 → /login?reset=true へリダイレクト
```

---

## バリデーション

| 項目 | ルール |
|------|--------|
| メールアドレス | 必須、メール形式 |
| パスワード | 必須、8文字以上 |
| パスワード確認 | パスワードと一致 |

---

## 使用コンポーネント

**shadcn/ui:**
- `Button`
- `Input`
- `Label`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`

**lucide-react:**
- `Mail`, `CheckCircle`, `XCircle`, `Loader2`, `KeyRound`, `ArrowLeft`

---

## バックエンド連携

| フロントエンド | バックエンドAPI |
|----------------|-----------------|
| 会員登録 | `POST /api/auth/register` |
| メール認証 | `POST /api/auth/verify-email` |
| パスワードリセット依頼 | `POST /api/auth/password-reset` |
| パスワード再設定 | `POST /api/auth/password-reset/confirm` |

---

## 画面遷移

```
[トップページ]
    │
    ├─→ [ログイン] ←────────────────────────┐
    │       │                               │
    │       ├─→ [パスワードリセット依頼]    │
    │       │           │                   │
    │       │           └─→ [送信完了]      │
    │       │                   │           │
    │       │    ←──────────────┘           │
    │       │                               │
    │       └─→ [会員登録]                  │
    │               │                       │
    │               └─→ [登録完了]          │
    │                       │               │
    │                       │ (メール)      │
    │                       ↓               │
    │               [メール認証]            │
    │                       │               │
    │                       └───────────────┘
    │
    │    (パスワードリセットメール)
    │               ↓
    └─────→ [パスワード再設定]
                    │
                    └─→ [ログイン]
```

---

## 次のステップ

1. **ログインページ改修**
   - パスワードリセット成功時のメッセージ表示（`?reset=true`）
   - メール認証完了時のメッセージ表示

2. **認証メール再送信機能**
   - ログインページにリンク追加
   - 再送信フォーム実装

3. **エラーハンドリング強化**
   - API別エラーメッセージ表示
   - ネットワークエラー対応
