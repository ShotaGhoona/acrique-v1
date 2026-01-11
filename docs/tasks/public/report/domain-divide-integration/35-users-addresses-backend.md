# Users & Addresses Backend 実装レポート

## 概要

ユーザー管理と配送先管理のバックエンドAPIを実装。オニオンアーキテクチャに従い、自分の情報取得/更新、パスワード変更、配送先CRUD機能を構築した。

---

## 実装したAPI

### Users API

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/users/me` | 自分の情報取得 |
| PUT | `/api/users/me` | 自分の情報更新 |
| PUT | `/api/users/me/password` | パスワード変更 |

### Addresses API

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/addresses` | 配送先一覧 |
| POST | `/api/addresses` | 配送先追加 |
| GET | `/api/addresses/{id}` | 配送先詳細 |
| PUT | `/api/addresses/{id}` | 配送先更新 |
| DELETE | `/api/addresses/{id}` | 配送先削除 |
| PUT | `/api/addresses/{id}/default` | デフォルト設定 |

---

## アーキテクチャ

### Domain層

**エンティティ:**

| ファイル | 説明 |
|----------|------|
| `app/domain/entities/user.py` | User（既存） |
| `app/domain/entities/address.py` | Address（新規） |

**リポジトリインターフェース:**

| ファイル | 説明 |
|----------|------|
| `app/domain/repositories/user_repository.py` | ユーザーリポジトリIF（既存） |
| `app/domain/repositories/address_repository.py` | 配送先リポジトリIF（新規） |

### Application層

**UseCase:**

| ファイル | 説明 |
|----------|------|
| `app/application/use_cases/user_usecase.py` | ユーザーユースケース（新規） |
| `app/application/use_cases/address_usecase.py` | 配送先ユースケース（新規） |

**スキーマ（DTO）:**

| ファイル | 説明 |
|----------|------|
| `app/application/schemas/user_schemas.py` | ユーザー入出力DTO（新規） |
| `app/application/schemas/address_schemas.py` | 配送先入出力DTO（新規） |

### Infrastructure層

**DBモデル:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/models/user_model.py` | UserModel（既存） |
| `app/infrastructure/db/models/address_model.py` | AddressModel（新規） |

**リポジトリ実装:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/repositories/user_repository_impl.py` | ユーザーリポジトリ実装（既存） |
| `app/infrastructure/db/repositories/address_repository_impl.py` | 配送先リポジトリ実装（新規） |

### Presentation層

| ファイル | 説明 |
|----------|------|
| `app/presentation/api/user_api.py` | ユーザーAPIエンドポイント（新規） |
| `app/presentation/api/address_api.py` | 配送先APIエンドポイント（新規） |
| `app/presentation/schemas/user_schemas.py` | ユーザーリクエスト/レスポンススキーマ（新規） |
| `app/presentation/schemas/address_schemas.py` | 配送先リクエスト/レスポンススキーマ（新規） |

### DI層

| ファイル | 説明 |
|----------|------|
| `app/di/user.py` | ユーザー依存性注入設定（新規） |
| `app/di/address.py` | 配送先依存性注入設定（新規） |

---

## DBスキーマ

### addresses テーブル

```sql
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    label VARCHAR(50),  -- 自宅/会社等
    name VARCHAR(100) NOT NULL,  -- 宛名
    postal_code VARCHAR(10) NOT NULL,
    prefecture VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address1 VARCHAR(255) NOT NULL,
    address2 VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
```

---

## APIレスポンス例

### GET /api/users/me

```json
{
  "id": 1,
  "email": "test@example.com",
  "name": "テストユーザー",
  "name_kana": "テストユーザー",
  "phone": "090-1234-5678",
  "company": "テスト株式会社",
  "is_email_verified": true,
  "created_at": "2026-01-03T18:46:56.499816"
}
```

### PUT /api/users/me

```json
{
  "id": 1,
  "email": "test@example.com",
  "name": "更新テストユーザー",
  "name_kana": "テストユーザー",
  "phone": "080-9999-8888",
  "company": "テスト株式会社",
  "message": "プロフィールを更新しました"
}
```

### GET /api/addresses

```json
{
  "addresses": [
    {
      "id": 1,
      "label": "自宅",
      "name": "山田太郎",
      "postal_code": "100-0001",
      "prefecture": "東京都",
      "city": "千代田区",
      "address1": "丸の内1-1-1",
      "address2": "テストビル101",
      "phone": "03-1234-5678",
      "is_default": true,
      "created_at": "2026-01-03T18:49:03.054559"
    }
  ],
  "total": 1
}
```

### POST /api/addresses

```json
{
  "address": {
    "id": 1,
    "label": "自宅",
    "name": "山田太郎",
    "postal_code": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "address1": "丸の内1-1-1",
    "address2": "テストビル101",
    "phone": "03-1234-5678",
    "is_default": true,
    "created_at": "2026-01-03T18:49:03.054559"
  },
  "message": "配送先を追加しました"
}
```

---

## テスト結果

### Users API

| Endpoint | Method | Status | 結果 |
|----------|--------|--------|------|
| /api/users/me | GET | 200 | 成功 |
| /api/users/me | PUT | 200 | 成功 |
| /api/users/me/password | PUT | 200 | 成功 |

### Addresses API

| Endpoint | Method | Status | 結果 |
|----------|--------|--------|------|
| /api/addresses | GET | 200 | 成功 |
| /api/addresses | POST | 201 | 成功 |
| /api/addresses/{id} | GET | 200 | 成功 |
| /api/addresses/{id} | PUT | 200 | 成功 |
| /api/addresses/{id} | DELETE | 200 | 成功 |
| /api/addresses/{id}/default | PUT | 200 | 成功 |

---

## マイグレーション

```bash
# 実行済み
docker exec acrique-v1-backend-1 alembic revision --autogenerate -m "add_addresses_table"
docker exec acrique-v1-backend-1 alembic upgrade head
```

マイグレーションファイル: `alembic/versions/4560cc3f66e5_add_addresses_table.py`

---

## セキュリティ考慮事項

1. **認証必須** - すべてのエンドポイントで `get_current_user_from_cookie` による認証チェック
2. **アクセス制御** - 配送先の取得/更新/削除時に `user_id` のチェックで他ユーザーへのアクセスを防止
3. **パスワード変更** - 現在のパスワードの検証が必要

---

## リファクタリング履歴

### 2026-01-04: ドメイン例外の導入

オニオンアーキテクチャの原則に従い、Application層から`fastapi.HTTPException`への依存を除去。

**変更内容:**
- `app/domain/exceptions/user.py` を新設:
  - `UserNotFoundError` - ユーザーが見つからない
  - `InvalidPasswordError` - パスワードが正しくない
- `app/domain/exceptions/address.py` を新設:
  - `AddressNotFoundError` - 配送先が見つからない
- `app/domain/exceptions/common.py` を使用:
  - `PermissionDeniedError` - 権限がない
  - `OperationFailedError` - 操作に失敗
- `app/presentation/exception_handlers.py` で例外→HTTPレスポンス変換

**効果:**
- Application層がPresentation層の詳細（FastAPI）に依存しなくなった
- エラーコードの一元管理が可能に
- アクセス制御エラーが統一的に処理されるように

---

## 次のステップ

1. **フロントエンド連携** - マイページのプロフィール編集・配送先管理画面との接続
2. **注文機能連携** - カート/チェックアウト時に配送先を選択できるようにする
3. **バリデーション強化** - 郵便番号・電話番号のフォーマットチェック
