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

## 次のステップ

[] S3 CORS設定
[] StorageServiceインターフェース作成
[] S3Service実装
[] 新規API実装（Presigned URL取得、画像追加、画像更新、画像削除）
[] フロントエンド対応
