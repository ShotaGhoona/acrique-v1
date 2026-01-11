# 消費者向け入稿機能 S3アップロード実装戦略書

## 概要

消費者がロゴ・QRコード・写真等のデータを入稿する機能を実装。
Admin画像アップロードと同様に「Presigned URL方式」を採用する。

---

## フロー図

```
【アップロードフロー】

┌─────────────┐  1. Presigned  ┌─────────────┐  2. 生成   ┌─────────────┐
│  Consumer   │ ─────────────→ │   Backend   │ ────────→ │     S3      │
│  (Frontend) │   URL取得依頼  │   API       │           │             │
└─────────────┘                └─────────────┘           └─────────────┘
       │                                                       │
       │  3. ファイル直接アップロード                          │
       └───────────────────────────────────────────────────────┘
       │
       │  4. URL登録（upload レコード作成）
       ▼
┌─────────────┐                ┌─────────────┐
│   Backend   │ ─────────────→ │  Database   │
│   API       │                │  (uploads)  │
└─────────────┘                └─────────────┘
```

```
【注文との紐付けフロー】

┌─────────────┐                              ┌─────────────┐
│  事前入稿   │  status: pending             │  注文確定   │
│  (upload済) │ ────────────────────────────→│  処理      │
└─────────────┘                              └─────────────┘
                                                    │
                                                    │ order_item_id を紐付け
                                                    │ status → submitted
                                                    ▼
                                             ┌─────────────┐
                                             │  Admin審査  │
                                             └─────────────┘
```

---

## API設計

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

| フィールド | 説明 |
|-----------|------|
| upload_url | S3へのPUT用署名付きURL |
| file_url | CloudFront配信URL（DB登録用） |
| s3_key | S3オブジェクトキー（削除時に使用） |
| expires_in | 有効期限（秒） |

---

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

> **注意**: この時点では `order_id`, `order_item_id` は null。注文確定時に紐付ける。

---

### 3. 入稿データ一覧取得

**GET** `/api/uploads`

自分のアップロード一覧を取得。

**レスポンス:**
```json
{
  "uploads": [
    {
      "id": 1,
      "file_name": "my-logo.png",
      "file_url": "https://cdn.acrique.jp/uploads/user-123/xxx.png",
      "upload_type": "logo",
      "status": "pending",
      "order_id": null,
      "order_item_id": null,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### 4. 入稿データ削除

**DELETE** `/api/uploads/{id}`

- 自分のアップロードのみ削除可能
- `status` が `pending` の場合のみ削除可能（注文紐付け後は不可）
- S3からもオブジェクトを削除

---

### 5. 注文明細への入稿紐付け

**PUT** `/api/orders/{order_id}/items/{item_id}/uploads`

注文確定時またはマイページから呼び出す。

**リクエスト:**
```json
{
  "upload_ids": [1, 2]
}
```

**処理内容:**
1. `uploads.order_id` と `uploads.order_item_id` を設定
2. `uploads.status` を `pending` → `submitted` に変更
3. `orders.status` が `awaiting_data` の場合、必要な入稿が揃ったかチェック

---

## S3ディレクトリ構造

```
acrique-v1-data/
├── products/           # 商品画像（Admin用）
│   └── {uuid}.jpg
└── uploads/            # 消費者入稿データ
    └── user-{user_id}/
        └── {uuid}.{ext}
```

---

## ファイル変更一覧

### バックエンド（新規作成）

| ファイル | 説明 |
|----------|------|
| `app/domain/entities/upload.py` | Uploadエンティティ |
| `app/domain/repositories/upload_repository.py` | リポジトリIF |
| `app/application/schemas/upload_schemas.py` | DTO |
| `app/application/use_cases/upload_usecase.py` | ユースケース |
| `app/infrastructure/db/models/upload_model.py` | SQLAlchemyモデル |
| `app/infrastructure/db/repositories/upload_repository_impl.py` | リポジトリ実装 |
| `app/presentation/api/upload_api.py` | APIエンドポイント |
| `app/presentation/schemas/upload_schemas.py` | リクエスト/レスポンス |
| `app/di/upload.py` | DI設定 |

### バックエンド（修正）

| ファイル | 修正内容 |
|----------|----------|
| `app/main.py` | upload_api ルーター追加 |
| `app/infrastructure/storage/s3_service.py` | uploads用フォルダ対応 |

### フロントエンド（新規作成）

| ファイル | 説明 |
|----------|------|
| `src/entities/upload/` | Upload エンティティ |
| `src/features/upload/upload-file/` | アップロード機能 |
| `src/features/upload/get-uploads/` | 一覧取得機能 |
| `src/features/upload/delete-upload/` | 削除機能 |
| `src/widgets/upload/dropzone/` | ドロップゾーンUI |
| `src/page-components/checkout/upload/` | チェックアウト入稿画面 |
| `src/page-components/mypage/orders/[id]/upload/` | マイページ入稿画面 |

### フロントエンド（修正）

| ファイル | 修正内容 |
|----------|----------|
| `src/app/(main)/checkout/upload/page.tsx` | ページ追加 |
| `src/app/(main)/mypage/orders/[id]/upload/page.tsx` | ページ追加 |

---

## 実装順序

| 順序 | タスク | 依存関係 |
|------|--------|----------|
| 1 | Uploadエンティティ・リポジトリIF作成 | なし |
| 2 | SQLAlchemyモデル・マイグレーション | 1 |
| 3 | リポジトリ実装 | 2 |
| 4 | S3Service修正（uploadsフォルダ対応） | なし |
| 5 | Uploadユースケース実装 | 3, 4 |
| 6 | Upload API実装 | 5 |
| 7 | フロントエンド: 型定義・API追加 | 6 |
| 8 | フロントエンド: Dropzoneコンポーネント | なし |
| 9 | フロントエンド: チェックアウト入稿画面 | 7, 8 |
| 10 | フロントエンド: マイページ入稿画面 | 7, 8 |
| 11 | 動作確認・テスト | 全て |

---

## セキュリティ考慮

### ファイル制限

| 項目 | 制限 |
|------|------|
| 許可形式 | image/jpeg, image/png, image/webp, application/pdf, image/svg+xml |
| 最大サイズ | 20MB |
| Presigned URL有効期限 | 1時間 |

### アクセス制御

- 自分のアップロードのみ閲覧・削除可能
- `status: pending` のみ削除可能
- 注文紐付け後は変更不可

### S3バケットポリシー

- `uploads/` フォルダは認証済みユーザーのみアクセス可能
- CloudFront経由の読み取りのみ許可

---

## 注意事項

### Admin画像アップロードとの違い

| 項目 | Admin | Consumer |
|------|-------|----------|
| S3フォルダ | `products/` | `uploads/user-{id}/` |
| 紐付け先 | product_images | uploads |
| 審査 | なし | あり（admin承認） |
| 削除条件 | 常に可能 | pending時のみ |

### 既存機能との整合性

- Admin入稿管理（`/api/admin/uploads`）は既存設計のまま
- `uploads.status` が `submitted` になったら Admin側で審査開始

---

## チェックリスト更新

### backend-checklist.md

```markdown
## Uploads（入稿）

| タスク | D | A | I | P |
|--------|---|---|---|---|
| Presigned URL取得 | [ ] | [ ] | [ ] | [ ] |
| アップロード登録 | [ ] | [ ] | [ ] | [ ] |
| 入稿データ一覧 | [ ] | [ ] | [ ] | [ ] |
| 入稿データ詳細 | [ ] | [ ] | [ ] | [ ] |
| 入稿データ削除 | [ ] | [ ] | [ ] | [ ] |
| 注文明細への紐付け | [ ] | [ ] | [ ] | [ ] |
```

### frontend-checklist.md

```markdown
## 入稿機能

| タスク | 状況 |
|--------|------|
| Dropzoneコンポーネント | [ ] |
| アップロード進捗表示 | [ ] |
| ファイル形式バリデーション | [ ] |
| チェックアウト入稿UI | [ ] |
| マイページ入稿UI | [ ] |
```
