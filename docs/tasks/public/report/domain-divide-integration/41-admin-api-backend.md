# Admin API Backend 実装レポート

## 概要

管理者向けAPIのバックエンドを実装。オニオンアーキテクチャに従い、Phase 1で管理者認証・顧客管理・管理者管理、Phase 2で注文管理・商品管理・ダッシュボード・操作ログを構築した。

---

## 実装したAPI

### Phase 1

#### Admin認証

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/admin/auth/login` | 管理者ログイン |
| POST | `/api/admin/auth/logout` | 管理者ログアウト |
| GET | `/api/admin/auth/status` | 認証状態確認 |

#### 顧客管理

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/users` | 顧客一覧（検索・ページネーション） |
| GET | `/api/admin/users/{id}` | 顧客詳細（注文数・累計購入金額含む） |
| GET | `/api/admin/users/{id}/orders` | 顧客の注文履歴 |

#### 管理者管理

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/admins` | 管理者一覧 |
| POST | `/api/admin/admins` | 管理者追加 |
| PUT | `/api/admin/admins/{id}` | 管理者更新 |
| DELETE | `/api/admin/admins/{id}` | 管理者削除 |

### Phase 2

#### ダッシュボード

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/dashboard` | ダッシュボード情報（本日の注文数/売上/対応待ち/製作中/新規顧客数） |
| GET | `/api/admin/dashboard/stats` | 売上統計（日/週/月単位、期間指定） |

#### 注文管理

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/orders` | 注文一覧（検索/ステータスフィルタ/日付範囲/ページネーション） |
| GET | `/api/admin/orders/{id}` | 注文詳細（明細含む） |
| PUT | `/api/admin/orders/{id}` | 注文更新（admin_notes等） |
| PUT | `/api/admin/orders/{id}/status` | ステータス変更（遷移ルール付き） |
| POST | `/api/admin/orders/{id}/ship` | 発送処理（tracking_number設定） |

#### 商品管理

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/products` | 商品一覧（検索/カテゴリ/公開状態フィルタ） |
| POST | `/api/admin/products` | 商品作成 |
| GET | `/api/admin/products/{id}` | 商品詳細 |
| PUT | `/api/admin/products/{id}` | 商品更新 |
| DELETE | `/api/admin/products/{id}` | 商品削除 |
| POST | `/api/admin/products/{id}/images` | 画像追加 |
| DELETE | `/api/admin/products/{id}/images/{image_id}` | 画像削除 |
| PUT | `/api/admin/products/{id}/options` | オプション更新（バルク） |
| PUT | `/api/admin/products/{id}/specs` | スペック更新（バルク） |
| PUT | `/api/admin/products/{id}/features` | 特長更新（バルク） |
| PUT | `/api/admin/products/{id}/faqs` | FAQ更新（バルク） |

#### 操作ログ

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/logs` | 操作ログ一覧（管理者/アクション/対象タイプ/日付でフィルタ） |

---

## アーキテクチャ

### Domain層

**例外:**

| ファイル | 説明 |
|----------|------|
| `app/domain/exceptions/admin.py` | Admin関連例外 |

例外クラス:
- `AdminNotFoundError` - 管理者が見つからない
- `AdminEmailAlreadyExistsError` - メール重複
- `AdminInactiveError` - アカウント無効化
- `AdminInvalidCredentialsError` - 認証失敗
- `AdminPermissionDeniedError` - 権限不足
- `CannotDeleteSelfError` - 自分自身を削除

**エンティティ:**

| ファイル | 説明 |
|----------|------|
| `app/domain/entities/admin.py` | Admin, AdminLog, AdminRole |

**リポジトリインターフェース:**

| ファイル | 説明 |
|----------|------|
| `app/domain/repositories/admin_repository.py` | IAdminRepository, IAdminLogRepository |
| `app/domain/repositories/user_repository.py` | get_all, count_all, count_new_this_month |
| `app/domain/repositories/order_repository.py` | get_all, count_all, get_stats, get_today_stats, get_pending_count, get_processing_count |

### Application層

**UseCase:**

| ファイル | 説明 |
|----------|------|
| `app/application/use_cases/admin_auth_usecase.py` | 管理者認証ユースケース |
| `app/application/use_cases/admin_user_usecase.py` | 顧客管理ユースケース |
| `app/application/use_cases/admin_admin_usecase.py` | 管理者管理ユースケース |
| `app/application/use_cases/admin_order_usecase.py` | 注文管理ユースケース |
| `app/application/use_cases/admin_product_usecase.py` | 商品管理ユースケース |
| `app/application/use_cases/admin_dashboard_usecase.py` | ダッシュボードユースケース |
| `app/application/use_cases/admin_log_usecase.py` | 操作ログユースケース |

**スキーマ（DTO）:**

| ファイル | 説明 |
|----------|------|
| `app/application/schemas/admin_auth_schemas.py` | 管理者認証DTO |
| `app/application/schemas/admin_user_schemas.py` | 顧客管理DTO |
| `app/application/schemas/admin_admin_schemas.py` | 管理者管理DTO |
| `app/application/schemas/admin_order_schemas.py` | 注文管理DTO |
| `app/application/schemas/admin_product_schemas.py` | 商品管理DTO |
| `app/application/schemas/admin_dashboard_schemas.py` | ダッシュボードDTO |
| `app/application/schemas/admin_log_schemas.py` | 操作ログDTO |

### Infrastructure層

**DBモデル:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/models/admin_model.py` | AdminModel, AdminLogModel |

**リポジトリ実装:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/repositories/admin_repository_impl.py` | 管理者リポジトリ実装 |
| `app/infrastructure/db/repositories/user_repository_impl.py` | ユーザーリポジトリ実装 |
| `app/infrastructure/db/repositories/order_repository_impl.py` | 注文リポジトリ実装 |

**セキュリティ:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/security/admin_security.py` | 管理者JWT認証 |

### Presentation層

| ファイル | 説明 |
|----------|------|
| `app/presentation/api/admin_auth_api.py` | Admin認証APIエンドポイント |
| `app/presentation/api/admin_user_api.py` | 顧客管理APIエンドポイント |
| `app/presentation/api/admin_admin_api.py` | 管理者管理APIエンドポイント |
| `app/presentation/api/admin_order_api.py` | 注文管理APIエンドポイント |
| `app/presentation/api/admin_product_api.py` | 商品管理APIエンドポイント |
| `app/presentation/api/admin_dashboard_api.py` | ダッシュボードAPIエンドポイント |
| `app/presentation/api/admin_log_api.py` | 操作ログAPIエンドポイント |
| `app/presentation/schemas/admin_*.py` | 各種リクエスト/レスポンススキーマ |
| `app/presentation/exception_handlers.py` | Admin例外マッピング追加 |

### DI層

| ファイル | 説明 |
|----------|------|
| `app/di/admin_auth.py` | Admin認証DI設定 |
| `app/di/admin_user.py` | 顧客管理DI設定 |
| `app/di/admin_admin.py` | 管理者管理DI設定 |
| `app/di/admin_order.py` | 注文管理DI設定 |
| `app/di/admin_product.py` | 商品管理DI設定 |
| `app/di/admin_dashboard.py` | ダッシュボードDI設定 |
| `app/di/admin_log.py` | 操作ログDI設定 |

---

## DBスキーマ

### admins テーブル

```sql
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,  -- super_admin/admin/staff
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX ix_admins_email ON admins(email);
```

### admin_logs テーブル

```sql
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES admins(id),
    action VARCHAR(50) NOT NULL,  -- login/logout/create/update/delete
    target_type VARCHAR(50) NOT NULL,  -- admin/user/product/order
    target_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX ix_admin_logs_created_at ON admin_logs(created_at);
```

---

## 認証方式

| 項目 | 値 |
|------|-----|
| Cookie名 | `admin_access_token`（ユーザー用`access_token`と区別） |
| JWT署名 | RS256（RSA非対称鍵） |
| ペイロード | `admin_id`, `role`, `exp`, `type: "admin"` |
| 有効期限 | 8時間（ユーザー用7日より短い） |
| Cookie属性 | HttpOnly, Secure, SameSite=Lax |

---

## 権限ルール

### AdminRole

| ロール | 説明 |
|--------|------|
| `super_admin` | 全権限 |
| `admin` | staffの管理のみ可能 |
| `staff` | 閲覧のみ |

### 権限マトリクス

| 操作 | super_admin | admin | staff |
|------|-------------|-------|-------|
| ダッシュボード閲覧 | ○ | ○ | ○ |
| 顧客一覧/詳細閲覧 | ○ | ○ | ○ |
| 注文一覧/詳細閲覧 | ○ | ○ | ○ |
| 注文更新 | ○ | ○ | × |
| ステータス変更 | ○ | ○ | × |
| 発送処理 | ○ | ○ | ○ |
| 商品一覧/詳細閲覧 | ○ | ○ | ○ |
| 商品追加/更新/削除 | ○ | ○ | × |
| 管理者一覧閲覧 | ○ | ○ | ○ |
| 管理者作成 | ○ | ○（staffのみ） | × |
| super_admin作成 | ○ | × | × |
| 管理者更新 | ○ | ○（staffのみ） | × |
| 管理者削除 | ○ | ○（staffのみ） | × |
| 自分自身の削除 | × | × | × |
| 操作ログ閲覧 | ○ | ○ | × |

---

## 注文ステータス遷移ルール

```
pending → awaiting_payment, cancelled
awaiting_payment → paid, cancelled
paid → awaiting_data, confirmed, cancelled
awaiting_data → data_reviewing
data_reviewing → confirmed, awaiting_data（差し戻し）
confirmed → processing
processing → shipped
shipped → delivered
delivered → （変更不可）
cancelled → （変更不可）
```

---

## APIレスポンス例

### GET /api/admin/dashboard

```json
{
  "summary": {
    "today_orders": 2,
    "today_revenue": 44500,
    "pending_orders": 0,
    "processing_orders": 1,
    "new_customers_this_month": 4
  }
}
```

### GET /api/admin/dashboard/stats

```json
{
  "data": [
    {
      "date": "2026-01-04",
      "orders": 2,
      "revenue": 44500
    }
  ],
  "summary": {
    "total_orders": 2,
    "total_revenue": 44500
  }
}
```

### GET /api/admin/orders

```json
{
  "orders": [
    {
      "id": 3,
      "user_id": 7,
      "order_number": "ORD-20250101-0001",
      "status": "delivered",
      "subtotal": 15000,
      "shipping_fee": 500,
      "tax": 1500,
      "total": 17000,
      "payment_method": "stripe",
      "paid_at": "2025-12-25T02:04:10.732253",
      "shipped_at": "2025-12-27T02:04:10.732258",
      "tracking_number": "1234-5678-9012",
      "delivered_at": "2025-12-30T02:04:10.732259",
      "cancelled_at": null,
      "notes": "配達時間は午後でお願いします",
      "created_at": "2026-01-04T02:04:10.867095"
    }
  ],
  "total": 4,
  "limit": 10,
  "offset": 0
}
```

### GET /api/admin/orders/{id}

```json
{
  "order": {
    "id": 3,
    "order_number": "ORD-20250101-0001",
    "status": "delivered",
    "total": 17000,
    "admin_notes": "テスト管理者メモ",
    "items": [
      {
        "id": 5,
        "product_id": "qr-cube",
        "product_name": "QR Cube",
        "product_name_ja": "QRキューブ",
        "quantity": 2,
        "unit_price": 5000,
        "options": {
          "size": {"label": "M（60mm）", "value": "medium", "price_diff": 0},
          "finish": {"label": "ミラー仕上げ", "value": "mirror", "price_diff": 1000}
        },
        "subtotal": 10000
      }
    ]
  }
}
```

### POST /api/admin/products

**Request:**
```json
{
  "id": "test-product-001",
  "name": "Test Product",
  "name_ja": "テスト商品",
  "slug": "test-product-001",
  "tagline": "テスト用商品です",
  "description": "これはテスト用の商品説明です。",
  "base_price": 10000,
  "category_id": "shop",
  "is_active": false,
  "is_featured": false,
  "sort_order": 999
}
```

**Response:**
```json
{
  "product": {
    "id": "test-product-001",
    "name": "Test Product",
    "name_ja": "テスト商品",
    "slug": "test-product-001",
    "tagline": "テスト用商品です",
    "base_price": 10000,
    "category_id": "shop",
    "is_active": false,
    "is_featured": false,
    "sort_order": 999,
    "created_at": "2026-01-04T17:49:05.218712",
    "images": [],
    "options": [],
    "specs": [],
    "features": [],
    "faqs": []
  },
  "message": "商品を作成しました"
}
```

### PUT /api/admin/products/{id}/options

**Request:**
```json
{
  "options": [
    {
      "name": "カラー",
      "is_required": true,
      "sort_order": 0,
      "values": [
        {"label": "ブラック", "price_diff": 0, "sort_order": 0},
        {"label": "ホワイト", "price_diff": 500, "sort_order": 1}
      ]
    }
  ]
}
```

**Response:**
```json
{
  "options": [
    {
      "id": 43,
      "name": "カラー",
      "is_required": true,
      "sort_order": 0,
      "values": [
        {"id": 124, "label": "ブラック", "price_diff": 0, "sort_order": 0},
        {"id": 125, "label": "ホワイト", "price_diff": 500, "sort_order": 1}
      ]
    }
  ],
  "message": "オプションを更新しました"
}
```

### GET /api/admin/logs

```json
{
  "logs": [
    {
      "id": 11,
      "admin_id": 1,
      "admin_name": "システム管理者",
      "action": "login",
      "target_type": "admin",
      "target_id": "1",
      "details": null,
      "ip_address": "127.0.0.1",
      "created_at": "2026-01-04T17:49:04.864501"
    },
    {
      "id": 2,
      "admin_id": 1,
      "admin_name": "システム管理者",
      "action": "create",
      "target_type": "admin",
      "target_id": "2",
      "details": {"role": "staff", "email": "staff@acrique.jp"},
      "ip_address": "192.168.65.1",
      "created_at": "2026-01-04T17:04:58.728454"
    }
  ],
  "total": 11,
  "limit": 10,
  "offset": 0
}
```

---

## エラーレスポンス例

### 認証エラー（Cookie未設定）

```json
{
  "detail": "管理者認証が必要です"
}
```

### ログイン失敗

```json
{
  "detail": "メールアドレスまたはパスワードが正しくありません",
  "code": "ADMIN_INVALID_CREDENTIALS"
}
```

### 権限不足

```json
{
  "detail": "この操作を行う権限がありません",
  "code": "ADMIN_PERMISSION_DENIED"
}
```

### ステータス遷移エラー

```json
{
  "detail": "このステータスへの変更はできません",
  "code": "INVALID_STATUS_TRANSITION"
}
```

---

## テスト結果

### Phase 1

| Endpoint | Method | Status | 結果 |
|----------|--------|--------|------|
| /api/admin/auth/login | POST | 200 | OK |
| /api/admin/auth/logout | POST | 200 | OK |
| /api/admin/auth/status | GET | 200 | OK |
| /api/admin/users | GET | 200 | OK |
| /api/admin/users/{id} | GET | 200 | OK |
| /api/admin/users/{id}/orders | GET | 200 | OK |
| /api/admin/admins | GET | 200 | OK |
| /api/admin/admins | POST | 201 | OK |
| /api/admin/admins/{id} | PUT | 200 | OK |
| /api/admin/admins/{id} | DELETE | 200 | OK |

### Phase 2

| Endpoint | Method | Status | 結果 |
|----------|--------|--------|------|
| /api/admin/dashboard | GET | 200 | OK |
| /api/admin/dashboard/stats | GET | 200 | OK |
| /api/admin/orders | GET | 200 | OK |
| /api/admin/orders/{id} | GET | 200 | OK |
| /api/admin/orders/{id} | PUT | 200 | OK |
| /api/admin/products | GET | 200 | OK |
| /api/admin/products | POST | 201 | OK |
| /api/admin/products/{id} | GET | 200 | OK |
| /api/admin/products/{id} | PUT | 200 | OK |
| /api/admin/products/{id}/specs | PUT | 200 | OK |
| /api/admin/products/{id}/options | PUT | 200 | OK |
| /api/admin/products/{id} | DELETE | 200 | OK |
| /api/admin/logs | GET | 200 | OK |
| /api/admin/logs?action=login | GET | 200 | OK |

**テスト結果: 24/24 成功 (100%)**

---

## マイグレーション

```bash
# 実行済み
docker exec acrique-v1-backend-1 alembic upgrade head
```

マイグレーションファイル: `alembic/versions/b5a8c2f91d34_add_admins_and_admin_logs_tables.py`

---

## 初期管理者

テスト用の初期管理者を作成済み:

| 項目 | 値 |
|------|-----|
| Email | admin@acrique.jp |
| Password | admin123 |
| Role | super_admin |

---

## セキュリティ考慮事項

1. **認証分離** - ユーザー用と管理者用でCookie名・JWTペイロードを分離
2. **有効期限短縮** - 管理者トークンは8時間（ユーザー用7日より短い）
3. **権限チェック** - 管理者の作成/更新/削除時にロールベースのアクセス制御
4. **自己削除禁止** - 管理者が自分自身を削除することを禁止
5. **ログ記録** - 管理者操作（ログイン/ログアウト/CRUD）をadmin_logsテーブルに記録
6. **パスワードハッシュ** - bcryptによるパスワードハッシュ化
7. **ステータス遷移制御** - 注文ステータスの不正な遷移を防止

---

## ファイル一覧

### Phase 1 新規作成（22ファイル）

| レイヤー | ファイル |
|----------|----------|
| Domain | `domain/exceptions/admin.py` |
| Domain | `domain/entities/admin.py` |
| Domain | `domain/repositories/admin_repository.py` |
| Infrastructure | `infrastructure/db/models/admin_model.py` |
| Infrastructure | `infrastructure/db/repositories/admin_repository_impl.py` |
| Infrastructure | `infrastructure/security/admin_security.py` |
| Application | `application/schemas/admin_auth_schemas.py` |
| Application | `application/schemas/admin_user_schemas.py` |
| Application | `application/schemas/admin_admin_schemas.py` |
| Application | `application/use_cases/admin_auth_usecase.py` |
| Application | `application/use_cases/admin_user_usecase.py` |
| Application | `application/use_cases/admin_admin_usecase.py` |
| Presentation | `presentation/schemas/admin_auth_schemas.py` |
| Presentation | `presentation/schemas/admin_user_schemas.py` |
| Presentation | `presentation/schemas/admin_admin_schemas.py` |
| Presentation | `presentation/api/admin_auth_api.py` |
| Presentation | `presentation/api/admin_user_api.py` |
| Presentation | `presentation/api/admin_admin_api.py` |
| DI | `di/admin_auth.py` |
| DI | `di/admin_user.py` |
| DI | `di/admin_admin.py` |
| Migration | `alembic/versions/b5a8c2f91d34_add_admins_and_admin_logs_tables.py` |

### Phase 2 新規作成（16ファイル）

| レイヤー | ファイル |
|----------|----------|
| Application | `application/schemas/admin_order_schemas.py` |
| Application | `application/schemas/admin_product_schemas.py` |
| Application | `application/schemas/admin_dashboard_schemas.py` |
| Application | `application/schemas/admin_log_schemas.py` |
| Application | `application/use_cases/admin_order_usecase.py` |
| Application | `application/use_cases/admin_product_usecase.py` |
| Application | `application/use_cases/admin_dashboard_usecase.py` |
| Application | `application/use_cases/admin_log_usecase.py` |
| Presentation | `presentation/schemas/admin_order_schemas.py` |
| Presentation | `presentation/schemas/admin_product_schemas.py` |
| Presentation | `presentation/schemas/admin_dashboard_schemas.py` |
| Presentation | `presentation/schemas/admin_log_schemas.py` |
| Presentation | `presentation/api/admin_order_api.py` |
| Presentation | `presentation/api/admin_product_api.py` |
| Presentation | `presentation/api/admin_dashboard_api.py` |
| Presentation | `presentation/api/admin_log_api.py` |
| DI | `di/admin_order.py` |
| DI | `di/admin_product.py` |
| DI | `di/admin_dashboard.py` |
| DI | `di/admin_log.py` |

### 修正ファイル

| ファイル | 変更内容 |
|----------|----------|
| `presentation/exception_handlers.py` | Admin例外のHTTPステータスマッピング追加 |
| `infrastructure/db/models/__init__.py` | AdminModel, AdminLogModelのエクスポート追加 |
| `main.py` | Admin APIルーターの登録 |
| `domain/repositories/user_repository.py` | get_all, count_all, count_new_this_month追加 |
| `infrastructure/db/repositories/user_repository_impl.py` | 上記実装 |
| `domain/repositories/order_repository.py` | get_all, count_all, get_stats, get_today_stats, get_pending_count, get_processing_count追加 |
| `infrastructure/db/repositories/order_repository_impl.py` | 上記実装 |
| `domain/repositories/admin_repository.py` | IAdminLogRepositoryにget_all, count_all追加 |
| `infrastructure/db/repositories/admin_repository_impl.py` | 上記実装 |
| `domain/entities/product.py` | ProductOptionValue.option_idをオプショナルに変更 |

---

## 完了状況

- [x] Phase 1: 管理者認証・顧客管理・管理者管理
- [x] Phase 2: 注文管理・商品管理・ダッシュボード・操作ログ
- [ ] 入稿管理（Uploads機能未実装のため保留）
- [ ] サイト設定（設定スキーマ未定義のため保留）
