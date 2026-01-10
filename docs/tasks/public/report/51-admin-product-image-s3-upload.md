# Admin商品画像 S3アップロード対応

## 概要

Admin画面での商品画像管理をURL手入力からS3アップロード（Presigned URL方式）に変更する。

## 関連ドキュメント

- 実装戦略書: `docs/tasks/public/strategy/13-admin-product-image-s3-upload.md`

---

## 作業ログ

### 2025-01-10: 既存コード削除

**目的**: 後方互換性の残骸を避けるため、既存の画像管理コードを削除して0から作り直す

**削除したファイル/コード**:

| ファイル | 削除内容 |
|----------|----------|
| `app/presentation/api/admin_product_api.py` | `add_product_image`, `delete_product_image` エンドポイント |
| `app/presentation/schemas/admin_product_schemas.py` | `AddProductImageRequest`, `AddProductImageResponse`, `DeleteProductImageResponse` |
| `app/application/use_cases/admin_product_usecase.py` | `add_image`, `delete_image` メソッド |
| `app/application/schemas/admin_product_schemas.py` | `AddProductImageInputDTO`, `AddProductImageOutputDTO`, `DeleteProductImageOutputDTO` |

**残したもの（商品詳細で使用中）**:
- `AdminProductImageDTO` / `AdminProductImageResponse`
- `ProductImage` エンティティ
- リポジトリの `add_image`, `delete_image` メソッド

---

### 2025-01-10: S3 CORS設定

**目的**: Presigned URLでのアップロードを可能にするためCORS設定を追加

**変更ファイル（4層アーキテクチャに従い下から順に）**:

| レイヤー | ファイル | 変更内容 |
|----------|----------|----------|
| 1 Construct | `lib/construct/datastore/s3-construct.ts` | `S3CorsConfig`インターフェース追加、CORS設定適用 |
| 2 Resource | `lib/resource/object-storage-resource.ts` | `cors`プロパティ追加 |
| 3 Stack | `lib/stack/object-storage/object-storage-stack.ts` | 環境設定からCORS構築 |
| Config | `config/environment.ts` | `ObjectStorageConfig`インターフェース追加 |
| Config | `config/dev.ts` | corsOrigins設定追加 |

**CORS設定内容**:
- 許可オリジン: Amplify URL, localhost:3000
- 許可メソッド: GET, PUT, POST
- 許可ヘッダー: *
- 公開ヘッダー: ETag

**デプロイ**: `cdk deploy ObjectStorageStack`が必要

---

### 2025-01-10: StorageServiceインターフェース作成

**目的**: S3操作を抽象化するインターフェースをApplication層に作成

**作成ファイル**:

| ファイル | 内容 |
|----------|------|
| `app/application/interfaces/storage_service.py` | `IStorageService`インターフェース、`PresignedUrlResult`データクラス |

**インターフェース定義**:
```python
class IStorageService(ABC):
    def generate_presigned_url(file_name, content_type, folder) -> PresignedUrlResult
    def delete_object(file_url) -> bool
```

**Domain層変更**:

| ファイル | 変更内容 |
|----------|----------|
| `app/domain/repositories/product_repository.py` | `get_image`, `update_image` メソッド追加 |
| `app/infrastructure/db/repositories/product_repository_impl.py` | 上記メソッドの実装追加 |

---

### 2025-01-10: DBカラム名変更 (url → s3_url)

**目的**: 画像URLがS3からのものであることを明示するためカラム名をリネーム

**変更ファイル一覧**:

| レイヤー | ファイル | 変更内容 |
|----------|----------|----------|
| Domain | `app/domain/entities/product.py` | `ProductImage.url` → `ProductImage.s3_url` |
| Infrastructure | `app/infrastructure/db/models/product_model.py` | `ProductImageModel.url` → `s3_url` |
| Infrastructure | `app/infrastructure/db/repositories/product_repository_impl.py` | マッピング修正 |
| Application | `app/application/schemas/admin_product_schemas.py` | `AdminProductImageDTO.url` → `s3_url` |
| Application | `app/application/schemas/product_schemas.py` | `ProductImageDTO.url` → `s3_url` |
| Application | `app/application/use_cases/admin_product_usecase.py` | 参照修正 |
| Application | `app/application/use_cases/product_usecase.py` | 参照修正 |
| Presentation | `app/presentation/schemas/admin_product_schemas.py` | `AdminProductImageResponse.url` → `s3_url` |
| Presentation | `app/presentation/schemas/product_schemas.py` | `ProductImageResponse.url` → `s3_url` |
| Infrastructure | `app/infrastructure/db/seeds/product_seed.py` | シードデータ修正 |
| Migration | `alembic/versions/c8f3a1b2d456_rename_url_to_s3_url_in_product_images.py` | カラム名変更マイグレーション |

**フロントエンド変更**:

| ファイル | 変更内容 |
|----------|----------|
| `src/entities/admin-product/model/types.ts` | `AdminProductImage.url` → `s3_url` |
| `src/entities/product/model/types.ts` | `ProductImage.url` → `s3_url` |
| `src/page-components/admin/.../MediaTab.tsx` | `image.url` → `image.s3_url` |

**デプロイ時の注意**: `alembic upgrade head` が必要

---

### 2025-01-10: S3Service実装

**目的**: S3へのファイルアップロード・削除を行うサービスを実装

**作成/変更ファイル**:

| ファイル | 内容 |
|----------|------|
| `app/config.py` | S3設定項目追加（`aws_s3_bucket_name`, `aws_s3_region`, `aws_access_key_id`, `aws_secret_access_key`） |
| `app/infrastructure/storage/__init__.py` | モジュール初期化 |
| `app/infrastructure/storage/s3_service.py` | S3Service実装 |

**S3Service機能**:

| メソッド | 説明 |
|----------|------|
| `generate_presigned_url()` | アップロード用Presigned URL生成 |
| `delete_object()` | S3からオブジェクト削除 |

**実装詳細**:
- ファイル形式制限: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Presigned URL有効期限: 3600秒（1時間）
- ユニークファイル名生成: UUID12桁 + 拡張子
- 認証: IAMロール優先、フォールバックでアクセスキー

**環境変数（.env）**:
```env
AWS_S3_BUCKET_NAME=dev-acrique-v1-data
AWS_S3_REGION=ap-northeast-1
# ローカル開発時のみ（ECSではIAMロール使用）
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
```

---

### 2025-01-10: 新規API実装

**目的**: 画像管理用の4つのAPIエンドポイントを実装

**変更ファイル（4層アーキテクチャに従い下から順に）**:

| レイヤー | ファイル | 変更内容 |
|----------|----------|----------|
| Domain | `app/domain/exceptions/product.py` | `ProductImageNotFoundError` 例外追加 |
| Application | `app/application/schemas/admin_product_schemas.py` | 画像管理用DTO追加（`GetPresignedUrlInputDTO`, `GetPresignedUrlOutputDTO`, `AddProductImageInputDTO`, `AddProductImageOutputDTO`, `UpdateProductImageInputDTO`, `UpdateProductImageOutputDTO`, `DeleteProductImageOutputDTO`） |
| Application | `app/application/use_cases/admin_product_usecase.py` | `IStorageService`注入、`get_presigned_url`, `add_image`, `update_image`, `delete_image` メソッド追加 |
| Presentation | `app/presentation/schemas/admin_product_schemas.py` | Request/Response追加（`GetPresignedUrlRequest`, `GetPresignedUrlResponse`, `AddProductImageRequest`, `AddProductImageResponse`, `UpdateProductImageRequest`, `UpdateProductImageResponse`, `DeleteProductImageResponse`） |
| Presentation | `app/presentation/api/admin_product_api.py` | 4エンドポイント追加 |
| DI | `app/di/admin_product.py` | `S3Service`注入追加 |

**新規エンドポイント**:

| メソッド | パス | 説明 |
|----------|------|------|
| POST | `/api/admin/products/{id}/images/presigned` | Presigned URL取得 |
| POST | `/api/admin/products/{id}/images` | 画像追加 |
| PUT | `/api/admin/products/{id}/images/{image_id}` | 画像更新（メタデータのみ） |
| DELETE | `/api/admin/products/{id}/images/{image_id}` | 画像削除 |

**アップロードフロー**:
1. フロントエンド: `/presigned` でPresigned URL取得
2. フロントエンド: 取得したURLに直接S3へPUTリクエスト
3. フロントエンド: アップロード成功後、`/images` でDB登録

---

### 2026-01-10: フロントエンド対応

**目的**: URL手入力からファイルアップロード（Presigned URL方式）に変更

**変更ファイル（FSDアーキテクチャに従い下から順に）**:

| レイヤー | ファイル | 変更内容 |
|----------|----------|----------|
| Entities | `src/entities/admin-product/model/types.ts` | 型定義追加・修正 |
| Entities | `src/entities/admin-product/api/admin-product-api.ts` | APIメソッド追加 |
| Features | `src/features/admin-product/upload-image/lib/use-upload-product-image.ts` | 新規作成 |
| Features | `src/features/admin-product/update-image/lib/use-update-product-image.ts` | 新規作成 |
| Page-Components | `src/page-components/admin/products/edit/ui/tab-components/MediaTab.tsx` | UI全面改修 |

**Entities層 - 型定義追加**:

| 型名 | 内容 |
|------|------|
| `GetPresignedUrlRequest` | `file_name`, `content_type` |
| `GetPresignedUrlResponse` | `upload_url`, `file_url`, `expires_in` |
| `AddProductImageRequest` | `url` → `s3_url` に修正 |
| `UpdateProductImageRequest` | `alt`, `is_main`, `sort_order` |
| `UpdateProductImageResponse` | `image`, `message` |

**Entities層 - APIメソッド追加**:

| メソッド | 説明 |
|----------|------|
| `getPresignedUrl(productId, data)` | Presigned URL取得 |
| `updateImage(productId, imageId, data)` | 画像メタデータ更新 |

**Features層 - 新規Hook**:

| Hook | 説明 |
|------|------|
| `useUploadProductImage` | Presigned URL取得 → S3アップロード → DB登録の一連処理。進捗コールバック対応 |
| `useUpdateProductImage` | 画像メタデータ更新（alt, is_main, sort_order） |

**Page-Components層 - MediaTab改修**:

| Before | After |
|--------|-------|
| URL手入力ダイアログ | ファイルアップロードダイアログ |
| `<Input placeholder="URL">` | ドラッグ&ドロップエリア |
| プレビューなし | アップロード前プレビュー表示 |
| 進捗表示なし | Progressバーで進捗表示 |
| バリデーションなし | ファイル形式・サイズチェック |
| メイン設定がPOST（バグ） | メイン設定がPUT（正常） |

**バリデーション設定**:
- 許可形式: JPEG, PNG, WebP, GIF
- 最大サイズ: 10MB

---

### 2026-01-10: 環境設定・デバッグ

**問題1: Network Error（バックエンドに到達しない）**

原因: `.env`の環境変数名が`config.py`と不一致

| 誤った変数名 | 正しい変数名 |
|--------------|--------------|
| `S3_BUCKET_NAME` | `AWS_S3_BUCKET_NAME` |
| `AWS_REGION` | `AWS_S3_REGION` |

**問題2: CORS Error（403 Forbidden on preflight）**

原因: S3のCORS設定に`localhost:3005`が含まれていなかった（`localhost:3000`のみ）

対応:
1. `infra/config/dev.ts`の`corsOrigins`に`http://localhost:3005`を追加
2. `npx cdk deploy dev-ObjectStorageStack`でデプロイ

**問題3: 500 Internal Server Error on OPTIONS**

原因: Presigned URLがグローバルエンドポイント（`s3.amazonaws.com`）で生成され、リージョナルエンドポイント（`s3.ap-northeast-1.amazonaws.com`）でなかった

対応: `app/infrastructure/storage/s3_service.py`を修正

```python
# 修正前
self._s3_client = boto3.client('s3', config=boto_config)

# 修正後
endpoint_url = f'https://s3.{self._region}.amazonaws.com'
boto_config = BotoConfig(
    region_name=self._region,
    signature_version='s3v4',
    s3={'addressing_style': 'virtual'},
)
self._s3_client = boto3.client(
    's3',
    region_name=self._region,
    endpoint_url=endpoint_url,
    config=boto_config,
    ...
)
```

**結果**: Presigned URLが正しいリージョナルエンドポイントで生成されるようになった

```
Endpoint provider result: https://dev-acrique-v1-data.s3.ap-northeast-1.amazonaws.com
```

---

## 次のステップ

[x] S3 CORS設定
[x] StorageServiceインターフェース作成
[x] DBカラム名変更 (url → s3_url)
[x] S3Service実装
[x] 新規API実装（Presigned URL取得、画像追加、画像更新、画像削除）
[x] フロントエンド対応
[x] 環境設定・デバッグ（CORS、リージョナルエンドポイント）
[ ] 動作確認・テスト
