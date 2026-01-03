# ACRIQUE API設計

RESTful API原則に従い、ドメインごとに整理。

---

## 認証 (Auth)

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/auth/register` | 会員登録 |
| POST | `/api/auth/login` | ログイン |
| POST | `/api/auth/logout` | ログアウト |
| GET | `/api/auth/status` | 認証状態確認 |
| POST | `/api/auth/password-reset` | パスワードリセット依頼 |
| POST | `/api/auth/password-reset/confirm` | パスワード再設定 |
| POST | `/api/auth/verify-email` | メール認証 |

---

## ユーザー (Users)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/users/me` | 自分の情報取得 |
| PUT | `/api/users/me` | 自分の情報更新 |
| PUT | `/api/users/me/password` | パスワード変更 |

---

## 配送先 (Addresses)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/addresses` | 配送先一覧 |
| POST | `/api/addresses` | 配送先追加 |
| GET | `/api/addresses/{id}` | 配送先詳細 |
| PUT | `/api/addresses/{id}` | 配送先更新 |
| DELETE | `/api/addresses/{id}` | 配送先削除 |
| PUT | `/api/addresses/{id}/default` | デフォルト設定 |

---

## カテゴリ (Categories)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/categories` | カテゴリ一覧 |
| GET | `/api/categories/{id}` | カテゴリ詳細 |

---

## 商品 (Products)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/products` | 商品一覧（フィルタ/ページング対応） |
| GET | `/api/products/{id}` | 商品詳細 |
| GET | `/api/products/{id}/options` | 商品オプション一覧 |
| GET | `/api/products/{id}/related` | 関連商品 |
| GET | `/api/products/featured` | おすすめ商品 |
| GET | `/api/products/search` | 商品検索 |

---

## カート (Cart)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/cart` | カート内容取得 |
| POST | `/api/cart/items` | カートに追加 |
| PUT | `/api/cart/items/{id}` | カート商品更新（数量等） |
| DELETE | `/api/cart/items/{id}` | カートから削除 |
| DELETE | `/api/cart` | カートを空にする |

---

## 注文 (Orders)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/orders` | 注文一覧 |
| POST | `/api/orders` | 注文作成 |
| GET | `/api/orders/{id}` | 注文詳細 |
| POST | `/api/orders/{id}/cancel` | 注文キャンセル |

---

## 見積もり (Estimates)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/estimates` | 見積もり一覧 |
| POST | `/api/estimates` | 見積もり依頼 |
| GET | `/api/estimates/{id}` | 見積もり詳細 |
| POST | `/api/estimates/{id}/approve` | 見積もり承認 |
| POST | `/api/estimates/{id}/revision` | 再見積もり依頼 |

---

## 入稿 (Uploads)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/uploads` | 入稿データ一覧 |
| POST | `/api/uploads` | ファイルアップロード |
| GET | `/api/uploads/{id}` | 入稿データ詳細 |
| DELETE | `/api/uploads/{id}` | 入稿データ削除 |
| POST | `/api/orders/{order_id}/uploads` | 注文への入稿 |
| POST | `/api/estimates/{estimate_id}/uploads` | 見積もりへの入稿 |

---

## 決済 (Payments)

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/payments/intent` | PaymentIntent作成 |
| POST | `/api/payments/webhook` | Stripe Webhook |

---

## お問い合わせ (Contact)

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/contact` | お問い合わせ送信 |

---

# Admin API

管理者用API。`/api/admin` プレフィックス。

---

## Admin認証 (Admin Auth)

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/admin/auth/login` | 管理者ログイン |
| POST | `/api/admin/auth/logout` | 管理者ログアウト |
| GET | `/api/admin/auth/status` | 認証状態確認 |

---

## ダッシュボード (Dashboard)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/dashboard` | ダッシュボード情報 |
| GET | `/api/admin/dashboard/stats` | 売上統計 |

---

## 注文管理 (Admin Orders)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/orders` | 注文一覧 |
| GET | `/api/admin/orders/{id}` | 注文詳細 |
| PUT | `/api/admin/orders/{id}` | 注文更新 |
| PUT | `/api/admin/orders/{id}/status` | ステータス更新 |
| POST | `/api/admin/orders/{id}/ship` | 発送処理 |

---

## 商品管理 (Admin Products)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/products` | 商品一覧 |
| POST | `/api/admin/products` | 商品追加 |
| GET | `/api/admin/products/{id}` | 商品詳細 |
| PUT | `/api/admin/products/{id}` | 商品更新 |
| DELETE | `/api/admin/products/{id}` | 商品削除 |
| POST | `/api/admin/products/{id}/images` | 画像追加 |
| DELETE | `/api/admin/products/{id}/images/{image_id}` | 画像削除 |
| PUT | `/api/admin/products/{id}/options` | オプション更新 |
| PUT | `/api/admin/products/{id}/specs` | スペック更新 |
| PUT | `/api/admin/products/{id}/features` | 特長更新 |
| PUT | `/api/admin/products/{id}/faqs` | FAQ更新 |

---

## カテゴリ管理 (Admin Categories)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/categories` | カテゴリ一覧 |
| POST | `/api/admin/categories` | カテゴリ追加 |
| PUT | `/api/admin/categories/{id}` | カテゴリ更新 |
| DELETE | `/api/admin/categories/{id}` | カテゴリ削除 |

---

## 見積もり管理 (Admin Estimates)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/estimates` | 見積もり一覧 |
| GET | `/api/admin/estimates/{id}` | 見積もり詳細 |
| PUT | `/api/admin/estimates/{id}` | 見積もり更新 |
| POST | `/api/admin/estimates/{id}/quote` | 見積もり回答 |

---

## 入稿管理 (Admin Uploads)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/uploads` | 入稿データ一覧 |
| GET | `/api/admin/uploads/{id}` | 入稿データ詳細 |
| POST | `/api/admin/uploads/{id}/approve` | 承認 |
| POST | `/api/admin/uploads/{id}/reject` | 差し戻し |

---

## 顧客管理 (Admin Users)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/users` | 顧客一覧 |
| GET | `/api/admin/users/{id}` | 顧客詳細 |
| GET | `/api/admin/users/{id}/orders` | 顧客の注文履歴 |

---

## 管理者管理 (Admin Admins)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/admins` | 管理者一覧 |
| POST | `/api/admin/admins` | 管理者追加 |
| PUT | `/api/admin/admins/{id}` | 管理者更新 |
| DELETE | `/api/admin/admins/{id}` | 管理者削除 |

---

## 操作ログ (Admin Logs)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/logs` | 操作ログ一覧 |

---

## サイト設定 (Admin Settings)

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/settings` | 設定取得 |
| PUT | `/api/admin/settings` | 設定更新 |

---

## ドメイン構成（オニオンアーキテクチャ対応）

```
backend/app/
├── domain/
│   ├── entities/
│   │   ├── user.py
│   │   ├── address.py
│   │   ├── category.py
│   │   ├── product.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── estimate.py
│   │   ├── upload.py
│   │   └── admin.py
│   └── repositories/
│       ├── user_repository.py
│       ├── address_repository.py
│       ├── category_repository.py
│       ├── product_repository.py
│       ├── cart_repository.py
│       ├── order_repository.py
│       ├── estimate_repository.py
│       ├── upload_repository.py
│       └── admin_repository.py
├── application/
│   └── use_cases/
│       ├── auth_usecase.py
│       ├── user_usecase.py
│       ├── address_usecase.py
│       ├── category_usecase.py
│       ├── product_usecase.py
│       ├── cart_usecase.py
│       ├── order_usecase.py
│       ├── estimate_usecase.py
│       ├── upload_usecase.py
│       ├── payment_usecase.py
│       └── admin/
│           ├── admin_auth_usecase.py
│           ├── admin_order_usecase.py
│           ├── admin_product_usecase.py
│           ├── admin_estimate_usecase.py
│           └── admin_upload_usecase.py
├── infrastructure/
│   └── db/
│       ├── models/
│       └── repositories/
└── presentation/
    └── api/
        ├── auth_api.py
        ├── user_api.py
        ├── address_api.py
        ├── category_api.py
        ├── product_api.py
        ├── cart_api.py
        ├── order_api.py
        ├── estimate_api.py
        ├── upload_api.py
        ├── payment_api.py
        ├── contact_api.py
        └── admin/
            ├── admin_auth_api.py
            ├── admin_dashboard_api.py
            ├── admin_order_api.py
            ├── admin_product_api.py
            ├── admin_category_api.py
            ├── admin_estimate_api.py
            ├── admin_upload_api.py
            ├── admin_user_api.py
            └── admin_log_api.py
```
