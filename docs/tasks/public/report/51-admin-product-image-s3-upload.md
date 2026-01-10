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

## 次のステップ

[x] S3 CORS設定
[x] StorageServiceインターフェース作成
[x] DBカラム名変更 (url → s3_url)
[x] S3Service実装
[] 新規API実装（Presigned URL取得、画像追加、画像更新、画像削除）
[] フロントエンド対応
