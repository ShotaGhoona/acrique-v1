# S3画像アップロード機能 実装レポート

## 概要

商品画像のS3アップロード機能を署名付きURL方式で実装。従来のURL直接入力方式から、ファイルドラッグ&ドロップ対応のアップロード機能に拡張した。

---

## 実装方式

### 署名付きURL方式のフロー

```
1. ユーザーがファイルを選択/ドロップ
2. フロント → POST /api/admin/products/{id}/images/presign
3. バックエンド → S3署名付きURL生成して返す
4. フロント → 署名付きURLでS3に直接PUT
5. フロント → POST /api/admin/products/{id}/images でDB保存
```

### メリット

- 大容量ファイルでもバックエンドに負荷がかからない
- S3への直接アップロードで高速
- バックエンドのメモリ消費を抑制

---

## バックエンド実装

### 新規ファイル

| ファイル | 説明 |
|---------|------|
| `app/application/interfaces/storage_service.py` | ストレージサービスインターフェース |
| `app/infrastructure/storage/__init__.py` | パッケージ初期化 |
| `app/infrastructure/storage/s3_storage_service.py` | S3サービス実装 |
| `app/di/storage.py` | 依存性注入 |

### 変更ファイル

| ファイル | 変更内容 |
|---------|----------|
| `.env` | S3設定追加 |
| `.env.example` | S3設定追加 |
| `app/config.py` | S3設定項目追加 |
| `requirements.txt` | boto3追加 |
| `app/presentation/api/admin_product_api.py` | 署名付きURL取得エンドポイント追加 |
| `app/presentation/schemas/admin_product_schemas.py` | Presigned URLスキーマ追加 |

### 新規APIエンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/admin/products/{id}/images/presign` | 署名付きアップロードURL取得 |

### 環境変数

```bash
# AWS S3 Settings
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
S3_BUCKET_NAME=your-bucket-name
S3_PRESIGNED_URL_EXPIRATION=3600
```

---

## フロントエンド実装

### 新規ファイル

| ファイル | 説明 |
|---------|------|
| `features/admin-product/upload-image/lib/use-upload-product-image.ts` | アップロードhook |

### 変更ファイル

| ファイル | 変更内容 |
|---------|----------|
| `entities/admin-product/model/types.ts` | 署名付きURL型定義追加 |
| `entities/admin-product/api/admin-product-api.ts` | `getPresignedUrl`メソッド追加 |
| `page-components/.../MediaTab.tsx` | ドラッグ&ドロップ対応に改修 |

### MediaTab機能

| 機能 | 状態 |
|------|------|
| ファイル選択 | 完了 |
| ドラッグ&ドロップ | 完了 |
| 複数ファイル一括アップロード | 完了 |
| アップロード中表示 | 完了 |
| ファイルバリデーション | 完了 |
| エラー表示 | 完了 |

### 対応ファイル形式

- JPEG
- PNG
- WebP
- GIF

最大ファイルサイズ: 10MB

---

## S3設定要件

### CORS設定

S3バケットに以下のCORSポリシーを設定する必要あり:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": ["http://localhost:3005", "https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

### IAMポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

---

## ファイル構造

### バックエンド

```
backend/app/
├── application/
│   └── interfaces/
│       └── storage_service.py  # 新規
├── infrastructure/
│   └── storage/
│       ├── __init__.py         # 新規
│       └── s3_storage_service.py  # 新規
├── di/
│   └── storage.py              # 新規
└── presentation/
    ├── api/
    │   └── admin_product_api.py  # 変更
    └── schemas/
        └── admin_product_schemas.py  # 変更
```

### フロントエンド

```
frontend/src/
├── entities/
│   └── admin-product/
│       ├── api/
│       │   └── admin-product-api.ts  # 変更
│       └── model/
│           └── types.ts  # 変更
├── features/
│   └── admin-product/
│       └── upload-image/
│           └── lib/
│               └── use-upload-product-image.ts  # 新規
└── page-components/
    └── admin/products/edit/ui/tab-components/
        └── MediaTab.tsx  # 変更
```

---

## TypeScript検証

```bash
npx tsc --noEmit
# エラーなし
```

---

## 動作確認前の準備

1. `docker compose build` でバックエンドを再ビルド（boto3インストール）
2. S3バケットを作成
3. S3バケットにCORS設定を適用
4. `.env`にAWS認証情報を設定
5. IAMユーザーに適切な権限を付与

---

## 関連タスク

- [x] 署名付きURL取得API
- [x] S3サービス実装
- [x] フロントエンドアップロードhook
- [x] MediaTabドラッグ&ドロップ対応
- [ ] S3バケット作成（インフラ）
- [ ] 本番環境CORS設定
