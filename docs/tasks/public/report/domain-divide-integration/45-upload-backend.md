# 消費者向け入稿機能 バックエンド実装レポート

## 概要

消費者がロゴ・QRコード・写真等のデータを入稿する機能のバックエンド実装を完了した。
Admin画像アップロードと同様に「Presigned URL方式」を採用。

---

## 実装したAPI

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/uploads/presigned` | Presigned URL取得 |
| POST | `/api/uploads` | アップロード完了登録 |
| GET | `/api/uploads` | 入稿データ一覧取得 |
| GET | `/api/uploads/{id}` | 入稿データ詳細取得 |
| DELETE | `/api/uploads/{id}` | 入稿データ削除 |
| PUT | `/api/orders/{order_id}/items/{item_id}/uploads` | 注文明細への入稿紐付け |

---

## ファイル構成

### 新規作成

| ファイル | 説明 |
|----------|------|
| `app/domain/entities/upload.py` | Uploadエンティティ |
| `app/domain/repositories/upload_repository.py` | リポジトリIF |
| `app/domain/exceptions/upload.py` | Upload関連例外 |
| `app/application/schemas/upload_schemas.py` | DTO |
| `app/application/use_cases/upload_usecase.py` | ユースケース |
| `app/infrastructure/db/models/upload_model.py` | SQLAlchemyモデル |
| `app/infrastructure/db/repositories/upload_repository_impl.py` | リポジトリ実装 |
| `app/presentation/api/upload_api.py` | APIエンドポイント |
| `app/presentation/schemas/upload_schemas.py` | リクエスト/レスポンス |
| `app/di/upload.py` | DI設定 |
| `alembic/versions/d1e2f3a4b5c6_add_uploads_table.py` | マイグレーション |

### 修正

| ファイル | 修正内容 |
|----------|----------|
| `app/application/interfaces/storage_service.py` | `PresignedUrlResult`に`s3_key`フィールド追加 |
| `app/infrastructure/storage/s3_service.py` | uploads用Content-Type許可リスト追加、s3_key返却対応 |
| `app/main.py` | `upload_router`, `order_uploads_router`追加 |
| `app/presentation/exception_handlers.py` | Upload例外のステータスコードマッピング追加 |

---

## データベース

### uploadsテーブル

```sql
CREATE TABLE uploads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    order_item_id INTEGER REFERENCES order_items(id),
    file_name VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    upload_type VARCHAR(50),
    text_content TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by INTEGER REFERENCES admins(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX ix_uploads_user_id ON uploads(user_id);
CREATE INDEX ix_uploads_order_id ON uploads(order_id);
CREATE INDEX ix_uploads_order_item_id ON uploads(order_item_id);
CREATE INDEX ix_uploads_status ON uploads(status);
```

### ステータス遷移

```
pending → submitted → reviewing → approved / rejected
```

| ステータス | 説明 |
|------------|------|
| pending | 注文前のアップロード（削除可能） |
| submitted | 注文確定後（注文に紐付け済み） |
| reviewing | Admin審査中 |
| approved | 承認済み |
| rejected | 差し戻し |

---

## S3ディレクトリ構造

```
acrique-v1-data/
├── products/              # 商品画像（Admin用）
│   └── {uuid}.jpg
└── uploads/               # 消費者入稿データ
    └── user-{user_id}/
        └── {uuid}.{ext}
```

---

## セキュリティ

### ファイル制限

| 項目 | 制限 |
|------|------|
| 許可形式 | image/jpeg, image/png, image/webp, application/pdf, image/svg+xml |
| 最大サイズ | 20MB |
| Presigned URL有効期限 | 1時間（3600秒） |

### アクセス制御

- 自分のアップロードのみ閲覧・削除可能
- `status: pending` のみ削除可能
- 注文紐付け後は変更不可

---

## 例外クラス

| 例外クラス | HTTPステータス | 説明 |
|------------|----------------|------|
| `UploadNotFoundError` | 404 | 入稿データが見つからない |
| `UploadNotOwnedError` | 403 | 他人の入稿データへのアクセス |
| `UploadNotDeletableError` | 400 | 注文紐付け後の削除試行 |
| `InvalidContentTypeError` | 400 | 許可されていないファイル形式 |
| `InvalidUploadTypeError` | 400 | 無効なアップロード種別 |
| `FileSizeTooLargeError` | 400 | ファイルサイズ超過 |
| `UploadAlreadyLinkedError` | 400 | 既に注文に紐付け済み |

---

## API詳細

### 1. Presigned URL取得

**POST** `/api/uploads/presigned`

**リクエスト:**
```json
{
  "file_name": "my-logo.png",
  "content_type": "image/png",
  "upload_type": "logo"
}
```

**レスポンス:**
```json
{
  "upload_url": "https://bucket.s3.amazonaws.com/uploads/user-123/xxx.png?X-Amz-...",
  "file_url": "https://cdn.acrique.jp/uploads/user-123/xxx.png",
  "s3_key": "uploads/user-123/xxx.png",
  "expires_in": 3600
}
```

### 2. アップロード完了登録

**POST** `/api/uploads`

**リクエスト:**
```json
{
  "file_name": "my-logo.png",
  "s3_key": "uploads/user-123/xxx.png",
  "file_url": "https://cdn.acrique.jp/uploads/user-123/xxx.png",
  "file_type": "image/png",
  "file_size": 102400,
  "upload_type": "logo"
}
```

**レスポンス:**
```json
{
  "id": 1,
  "file_name": "my-logo.png",
  "file_url": "https://cdn.acrique.jp/uploads/user-123/xxx.png",
  "upload_type": "logo",
  "status": "pending",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### 3. 入稿データ一覧取得

**GET** `/api/uploads`

**レスポンス:**
```json
{
  "uploads": [
    {
      "id": 1,
      "file_name": "my-logo.png",
      "file_url": "https://cdn.acrique.jp/uploads/user-123/xxx.png",
      "file_type": "image/png",
      "file_size": 102400,
      "upload_type": "logo",
      "status": "pending",
      "order_id": null,
      "order_item_id": null,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 4. 入稿データ削除

**DELETE** `/api/uploads/{id}`

- 自分のアップロードのみ削除可能
- `status` が `pending` の場合のみ削除可能
- S3からもオブジェクトを削除

### 5. 注文明細への入稿紐付け

**PUT** `/api/orders/{order_id}/items/{item_id}/uploads`

**リクエスト:**
```json
{
  "upload_ids": [1, 2]
}
```

**レスポンス:**
```json
{
  "linked_count": 2,
  "message": "2件の入稿データを紐付けました"
}
```

**処理内容:**
1. `uploads.order_id` と `uploads.order_item_id` を設定
2. `uploads.status` を `pending` → `submitted` に変更

---

## 次のステップ

1. マイグレーション実行: `alembic upgrade head`
2. フロントエンド実装
   - Dropzoneコンポーネント
   - チェックアウト入稿画面
   - マイページ入稿画面
3. Admin入稿管理API実装（審査機能）

---

## チェックリスト

| タスク | 状況 |
|--------|------|
| Uploadエンティティ | [x] |
| リポジトリIF・実装 | [x] |
| SQLAlchemyモデル | [x] |
| マイグレーション | [x] |
| S3Service修正 | [x] |
| ユースケース | [x] |
| スキーマ（DTO） | [x] |
| APIエンドポイント | [x] |
| DI設定 | [x] |
| main.py修正 | [x] |
| 例外ハンドラー | [x] |
