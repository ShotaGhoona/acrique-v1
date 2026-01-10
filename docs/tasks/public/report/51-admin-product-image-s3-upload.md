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

## 次のステップ

[x] S3 CORS設定
[x] StorageServiceインターフェース作成
[] S3Service実装
[] 新規API実装（Presigned URL取得、画像追加、画像更新、画像削除）
[] フロントエンド対応
