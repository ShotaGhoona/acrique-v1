# Admin商品画像 S3アップロード実装戦略書

## 概要

Admin画面での商品画像管理を「URL手入力」から「S3へのファイルアップロード（Presigned URL方式）」に変更する。
また、メイン画像設定のバグ（POST画像追加APIの誤用）を修正する。

---

## Before / After 比較

### 画像追加フロー

```
【Before】
┌─────────────┐    URL入力     ┌─────────────┐
│   Admin     │ ─────────────→ │   Backend   │
│  画面      │   (手動入力)    │   API       │
└─────────────┘                └─────────────┘
                                     │
                                     ▼
                               ┌─────────────┐
                               │  Database   │
                               │  (URLのみ)  │
                               └─────────────┘

【After】
┌─────────────┐  1. Presigned  ┌─────────────┐  2. 生成   ┌─────────────┐
│   Admin     │ ─────────────→ │   Backend   │ ────────→ │     S3      │
│  画面      │   URL取得依頼  │   API       │           │             │
└─────────────┘                └─────────────┘           └─────────────┘
       │                                                       │
       │  3. ファイル直接アップロード                          │
       └───────────────────────────────────────────────────────┘
       │
       │  4. URL登録
       ▼
┌─────────────┐                ┌─────────────┐
│   Backend   │ ─────────────→ │  Database   │
│   API       │                │  (S3 URL)   │
└─────────────┘                └─────────────┘
```

### UI比較

| 項目 | Before | After |
|------|--------|-------|
| 画像追加方法 | URLテキスト入力 | ドラッグ&ドロップ / ファイル選択 |
| プレビュー | なし | アップロード前にプレビュー表示 |
| 進捗表示 | なし | アップロード進捗バー |
| バリデーション | なし | ファイル形式・サイズチェック |

### API比較

| 操作 | Before | After |
|------|--------|-------|
| 画像追加 | `POST /images` (URL指定) | `POST /images/upload/presigned` → S3アップロード → `POST /images` |
| メイン設定 | `POST /images` (バグ: 重複作成) | `PUT /images/{id}` (正しい更新) |
| 画像削除 | `DELETE /images/{id}` | `DELETE /images/{id}` (+ S3削除) |

---

## 現状の問題点

### 問題1: URL手入力による運用負荷

**現在の実装**: `frontend/src/page-components/admin/products/edit/ui/tab-components/MediaTab.tsx`

```typescript
// 行157-162: URL手入力フィールド
<Input
  placeholder='https://example.com/image.jpg'
  value={newImageUrl}
  onChange={(e) => setNewImageUrl(e.target.value)}
/>
```

**問題**:
- 管理者がS3に別途アップロードし、URLをコピペする必要がある
- 運用が煩雑でヒューマンエラーが発生しやすい

---

### 問題2: メイン画像設定のバグ

**現在の実装**: `MediaTab.tsx` 行66-79

```typescript
const handleSetMain = (imageId: number) => {
  const image = images.find((img) => img.id === imageId);
  if (!image) return;

  // バグ: 既存画像の is_main を変更するために POST（追加）を使用
  addImageMutation.mutate({
    productId,
    data: {
      url: image.url,        // 既存URLを再送信
      alt: image.alt || undefined,
      is_main: true,         // これだけ変えたい
      sort_order: image.sort_order,
    },
  });
};
```

**問題**:
- `PUT`（更新）ではなく`POST`（追加）を使用
- 同じURLで複数レコードが作成される可能性
- 画像更新用のエンドポイントが存在しない

---

## 修正内容

### バックエンド

#### 1. S3サービスの追加

**新規ファイル**: `backend/app/infrastructure/storage/s3_service.py`

```python
class S3Service:
    def generate_presigned_url(
        self,
        file_name: str,
        content_type: str,
        folder: str = "products"
    ) -> PresignedUrlResult:
        """アップロード用のPresigned URLを生成"""
        pass

    def delete_object(self, key: str) -> bool:
        """S3からオブジェクトを削除"""
        pass
```

**インターフェース**: `backend/app/application/interfaces/storage_service.py`

```python
class StorageServiceInterface(ABC):
    @abstractmethod
    def generate_presigned_url(...) -> PresignedUrlResult: ...

    @abstractmethod
    def delete_object(key: str) -> bool: ...
```

---

#### 2. Presigned URL取得API

**新規エンドポイント**:

| Method | Path | 説明 |
|--------|------|------|
| POST | `/api/admin/products/{id}/images/upload/presigned` | Presigned URL取得 |

**リクエスト**:
```json
{
  "file_name": "product-image.jpg",
  "content_type": "image/jpeg"
}
```

**レスポンス**:
```json
{
  "upload_url": "https://bucket.s3.amazonaws.com/...",
  "file_url": "https://bucket.s3.amazonaws.com/products/xxx.jpg",
  "expires_in": 3600
}
```

---

#### 3. 画像更新API（新規追加）

**新規エンドポイント**:

| Method | Path | 説明 |
|--------|------|------|
| PUT | `/api/admin/products/{id}/images/{image_id}` | 画像メタデータ更新 |

**リクエスト**:
```json
{
  "alt": "代替テキスト",
  "is_main": true,
  "sort_order": 0
}
```

---

#### 4. 画像削除API（修正）

**既存エンドポイント**: `DELETE /api/admin/products/{id}/images/{image_id}`

**修正内容**: S3からもオブジェクトを削除

```python
def delete_image(self, product_id: str, image_id: int) -> None:
    image = self.product_repository.get_image(image_id)
    if image:
        # S3から削除
        self.storage_service.delete_object(image.url)
        # DBから削除
        self.product_repository.delete_image(image_id)
```

---

### フロントエンド

#### 1. 画像アップロードUI

**修正ファイル**: `MediaTab.tsx`

| Before | After |
|--------|-------|
| URL入力ダイアログ | ファイルアップロードダイアログ |
| `<Input placeholder="URL">` | `<Dropzone accept={...}>` |

**新規コンポーネント**:
```
frontend/src/shared/ui/image-uploader/
├── ImageUploader.tsx       # ドラッグ&ドロップUI
├── UploadProgress.tsx      # 進捗表示
└── ImagePreview.tsx        # プレビュー表示
```

---

#### 2. 画像更新Hook（新規追加）

**新規ファイル**: `frontend/src/features/admin-product/update-image/`

```typescript
export const useUpdateProductImage = () => {
  return useMutation({
    mutationFn: ({ productId, imageId, data }) =>
      adminProductApi.updateImage(productId, imageId, data),
  });
};
```

---

#### 3. handleSetMainの修正

```typescript
// Before: POST（追加）を使用
addImageMutation.mutate({ ... });

// After: PUT（更新）を使用
updateImageMutation.mutate({
  productId,
  imageId,
  data: { is_main: true },
});
```

---

### インフラ

#### 1. S3 CORS設定

**修正ファイル**: `infra/lib/object-storage-stack.ts`

```typescript
bucket.addCorsRule({
  allowedMethods: [
    s3.HttpMethods.GET,
    s3.HttpMethods.PUT,
    s3.HttpMethods.POST,
  ],
  allowedOrigins: [
    'https://main.d17fbeoc59o61t.amplifyapp.com',
    'http://localhost:3000',
  ],
  allowedHeaders: ['*'],
  maxAge: 3600,
});
```

---

#### 2. バックエンド環境変数

**追加する環境変数**:

| 変数名 | 説明 |
|--------|------|
| `AWS_S3_BUCKET_NAME` | S3バケット名 |
| `AWS_S3_REGION` | リージョン |
| `AWS_ACCESS_KEY_ID` | アクセスキー（ECSの場合はIAMロール推奨） |
| `AWS_SECRET_ACCESS_KEY` | シークレットキー（ECSの場合はIAMロール推奨） |

---

## ファイル変更一覧

### バックエンド（新規作成）

| ファイル | 説明 |
|----------|------|
| `app/application/interfaces/storage_service.py` | ストレージサービスIF |
| `app/application/schemas/storage_schemas.py` | Presigned URL DTO |
| `app/infrastructure/storage/__init__.py` | - |
| `app/infrastructure/storage/s3_service.py` | S3サービス実装 |
| `app/di/storage.py` | DI設定 |

### バックエンド（修正）

| ファイル | 修正内容 |
|----------|----------|
| `app/presentation/api/admin_product_api.py` | Presigned URL API追加、画像更新API追加 |
| `app/presentation/schemas/admin_product_schemas.py` | リクエスト/レスポンススキーマ追加 |
| `app/application/schemas/admin_product_schemas.py` | DTO追加 |
| `app/application/use_cases/admin_product_usecase.py` | update_image、S3連携処理追加 |
| `app/di/admin_product.py` | StorageService依存追加 |

### フロントエンド（新規作成）

| ファイル | 説明 |
|----------|------|
| `src/shared/ui/image-uploader/ImageUploader.tsx` | アップロードUI |
| `src/shared/ui/image-uploader/UploadProgress.tsx` | 進捗表示 |
| `src/features/admin-product/update-image/` | 画像更新feature |
| `src/features/admin-product/upload-image/` | 画像アップロードfeature |

### フロントエンド（修正）

| ファイル | 修正内容 |
|----------|----------|
| `src/entities/admin-product/api/admin-product-api.ts` | API追加 |
| `src/entities/admin-product/model/types.ts` | 型定義追加 |
| `src/page-components/admin/products/edit/ui/tab-components/MediaTab.tsx` | UI全面改修 |

### インフラ（修正）

| ファイル | 修正内容 |
|----------|----------|
| `infra/lib/object-storage-stack.ts` | CORS設定追加 |
| `infra/lib/backend-stack.ts` | 環境変数追加（必要に応じて） |

---

## 実装順序

| 順序 | タスク | 依存関係 |
|------|--------|----------|
| 1 | S3 CORS設定 | なし |
| 2 | StorageServiceインターフェース作成 | なし |
| 3 | S3Service実装 | 2 |
| 4 | Presigned URL API実装 | 3 |
| 5 | 画像更新API実装（PUT） | なし |
| 6 | 画像削除API修正（S3削除追加） | 3 |
| 7 | フロントエンド: 型定義・API追加 | 4, 5 |
| 8 | フロントエンド: ImageUploaderコンポーネント | なし |
| 9 | フロントエンド: MediaTab改修 | 7, 8 |
| 10 | 動作確認・テスト | 全て |

---

## 注意事項

### セキュリティ

1. **Presigned URLの有効期限**: 3600秒（1時間）を推奨
2. **ファイル形式制限**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`のみ許可
3. **ファイルサイズ制限**: 10MB以下
4. **S3バケットポリシー**: パブリックアクセスは読み取りのみ許可

### 既存データ

- 既存の`product_images`テーブルのURLはそのまま維持
- 新規アップロード分のみS3に保存
- 既存画像の削除時はS3削除をスキップ（外部URLの場合）

### フォールバック

- S3接続エラー時はエラーメッセージを表示
- アップロード失敗時は自動リトライ（最大3回）

---

## チェックリスト更新

### backend-checklist.md

```markdown
## 共通基盤

| タスク | 状況 |
|--------|------|
| S3連携設定 | [ ] → [x] |

## Admin Products（商品管理）

| タスク | D | A | I | P |
|--------|---|---|---|---|
| 画像更新 | [ ] | [ ] | [ ] | [ ] |  ← 新規追加
| Presigned URL取得 | [ ] | [ ] | [ ] | [ ] |  ← 新規追加
```

### frontend-checklist.md

```markdown
## ファイルアップロード

| タスク | 状況 |
|--------|------|
| ドラッグ&ドロップ | [ ] → [x] |
| プレビュー表示 | [ ] → [x] |
| ファイル形式バリデーション | [ ] → [x] |
| アップロード進捗 | [ ] → [x] |
```

### infra-checklist.md

```markdown
## ObjectStorageStack

| タスク | 状況 |
|--------|------|
| CORS設定 | [ ] → [x] |
```

---

## 参考資料

- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- `docs/rules/architecture/BACKEND.md` - オニオンアーキテクチャ
- `docs/tasks/public/infra-checklist.md` - インフラ進捗
