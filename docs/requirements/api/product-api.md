# 商品API仕様書

## 概要

商品関連のAPIエンドポイント仕様です。
Base URL: `/api/products`

---

## エンドポイント一覧

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | `/` | 商品一覧取得 | 不要 |
| GET | `/featured` | おすすめ商品取得 | 不要 |
| GET | `/search` | 商品検索 | 不要 |
| GET | `/{product_id}` | 商品詳細取得 | 不要 |
| GET | `/{product_id}/options` | 商品オプション取得 | 不要 |
| GET | `/{product_id}/related` | 関連商品取得 | 不要 |

---

## 1. 商品一覧取得

### `GET /api/products`

公開中の商品一覧を取得します。カテゴリやおすすめフラグでフィルタリング可能です。

#### リクエスト

クエリパラメータで条件を指定します。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| category_id | string | - | カテゴリID (shop/office/you) |
| is_featured | boolean | - | おすすめ商品のみ |
| limit | number | - | 取得件数（デフォルト: 20、最大: 100） |
| offset | number | - | オフセット（デフォルト: 0） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "products": [
    {
      "id": "qr-cube",
      "category_id": "shop",
      "name": "QR Code Cube",
      "name_ja": "QRコードキューブ",
      "slug": "qr-cube",
      "tagline": "あなたのQRを、アートに。",
      "base_price": 8800,
      "price_note": "サイズ・オプションにより変動",
      "is_featured": true,
      "main_image_url": "https://d3u751jak9qu2w.cloudfront.net/products/xxx.jpg",
      "images": [
        {
          "id": 118,
          "s3_url": "https://d3u751jak9qu2w.cloudfront.net/products/xxx.jpg",
          "alt": null,
          "is_main": true,
          "sort_order": 3
        }
      ]
    }
  ],
  "total": 18,
  "limit": 20,
  "offset": 0
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| products | array | 商品一覧 |
| products[].id | string | 商品ID |
| products[].category_id | string | カテゴリID |
| products[].name | string | 英語名 |
| products[].name_ja | string | 日本語名 |
| products[].slug | string | URL用スラッグ |
| products[].tagline | string \| null | キャッチコピー |
| products[].base_price | number | 税抜基本価格 |
| products[].price_note | string \| null | 価格補足 |
| products[].is_featured | boolean | おすすめ商品フラグ |
| products[].main_image_url | string \| null | メイン画像URL |
| products[].images | array | 商品画像一覧 |
| products[].images[].id | number | 画像ID |
| products[].images[].s3_url | string | 画像URL（CloudFront経由） |
| products[].images[].alt | string \| null | 代替テキスト |
| products[].images[].is_main | boolean | メイン画像フラグ |
| products[].images[].sort_order | number | 並び順 |
| total | number | 総件数 |
| limit | number | 取得件数 |
| offset | number | オフセット |

---

## 2. おすすめ商品取得

### `GET /api/products/featured`

おすすめ商品の一覧を取得します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| limit | number | - | 取得件数（デフォルト: 10、最大: 50） |

#### レスポンス

**成功時 (200 OK)**

レスポンス形式は商品一覧取得と同じです。

---

## 3. 商品検索

### `GET /api/products/search`

キーワードで商品を検索します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| keyword | string | ○ | 検索キーワード（1文字以上） |
| category_id | string | - | カテゴリIDでフィルタリング |
| limit | number | - | 取得件数（デフォルト: 20、最大: 100） |
| offset | number | - | オフセット（デフォルト: 0） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "products": [
    {
      "id": "qr-cube",
      "category_id": "shop",
      "name": "QR Code Cube",
      "name_ja": "QRコードキューブ",
      "slug": "qr-cube",
      "tagline": "あなたのQRを、アートに。",
      "base_price": 8800,
      "price_note": "サイズ・オプションにより変動",
      "is_featured": true,
      "main_image_url": "https://d3u751jak9qu2w.cloudfront.net/products/xxx.jpg",
      "images": []
    }
  ],
  "total": 1,
  "keyword": "QR",
  "category_id": null,
  "limit": 20,
  "offset": 0
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| products | array | 検索結果 |
| total | number | 総件数 |
| keyword | string | 検索キーワード |
| category_id | string \| null | フィルタリングしたカテゴリID |
| limit | number | 取得件数 |
| offset | number | オフセット |

---

## 4. 商品詳細取得

### `GET /api/products/{product_id}`

商品IDを指定して詳細情報を取得します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| product_id | string | ○ | 商品ID（パスパラメータ） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "id": "qr-cube",
  "category_id": "shop",
  "name": "QR Code Cube",
  "name_ja": "QRコードキューブ",
  "slug": "qr-cube",
  "tagline": "あなたのQRを、アートに。",
  "description": "Instagram、決済用QR、Wi-Fi案内など、あらゆるQRコードを高級感あるキューブに。",
  "long_description": "店舗のレジ横やテーブルに置くだけで、空間の格が上がる。...",
  "base_price": 8800,
  "price_note": "サイズ・オプションにより変動",
  "lead_time_days": 5,
  "lead_time_note": "5営業日〜",
  "requires_upload": true,
  "upload_type": "qr",
  "upload_note": "QRコードの画像データ（PNG/JPG）またはリンク先URLをお送りください",
  "is_featured": true,
  "images": [
    {
      "id": 118,
      "s3_url": "https://d3u751jak9qu2w.cloudfront.net/products/xxx.jpg",
      "alt": null,
      "is_main": true,
      "sort_order": 3
    }
  ],
  "options": [
    {
      "id": 44,
      "name": "サイズ",
      "is_required": true,
      "sort_order": 1,
      "values": [
        {
          "id": 126,
          "label": "50mm角",
          "price_diff": 0,
          "description": "コンパクト",
          "sort_order": 1
        },
        {
          "id": 127,
          "label": "60mm角",
          "price_diff": 2000,
          "description": "標準サイズ",
          "sort_order": 2
        }
      ]
    }
  ],
  "specs": [
    {
      "id": 59,
      "label": "サイズ",
      "value": "50mm / 60mm / 80mm 角",
      "sort_order": 1
    }
  ],
  "features": [
    {
      "id": 37,
      "title": "高級感のある佇まい",
      "description": "10mm以上の厚みが生み出す重厚感。店舗の雰囲気を損なわず、むしろ格上げします。",
      "sort_order": 1
    }
  ],
  "faqs": [
    {
      "id": 37,
      "question": "QRコードのデータはどのように入稿すればよいですか？",
      "answer": "QRコードの画像データ（PNG/JPG）をお送りいただくか、リンク先URLをお知らせください。",
      "sort_order": 1
    }
  ],
  "created_at": "2026-01-06T10:06:25.306628",
  "updated_at": "2026-01-06T10:06:25.306628"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | string | 商品ID |
| category_id | string | カテゴリID |
| name | string | 英語名 |
| name_ja | string | 日本語名 |
| slug | string | URL用スラッグ |
| tagline | string \| null | キャッチコピー |
| description | string \| null | 短い説明 |
| long_description | string \| null | 詳細説明 |
| base_price | number | 税抜基本価格 |
| price_note | string \| null | 価格補足 |
| lead_time_days | number \| null | 標準納期（日数） |
| lead_time_note | string \| null | 納期補足 |
| requires_upload | boolean | 入稿必須フラグ |
| upload_type | string \| null | 入稿タイプ (logo/qr/photo/text) |
| upload_note | string \| null | 入稿時の注意 |
| is_featured | boolean | おすすめ商品フラグ |
| images | array | 商品画像一覧 |
| options | array | 商品オプション一覧 |
| specs | array | 商品スペック一覧 |
| features | array | 商品特長一覧 |
| faqs | array | よくある質問一覧 |
| created_at | string (ISO 8601) | 作成日時 |
| updated_at | string (ISO 8601) | 更新日時 |

---

## 5. 商品オプション取得

### `GET /api/products/{product_id}/options`

指定した商品のオプション一覧を取得します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| product_id | string | ○ | 商品ID（パスパラメータ） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "product_id": "qr-cube",
  "options": [
    {
      "id": 44,
      "name": "サイズ",
      "is_required": true,
      "sort_order": 1,
      "values": [
        {
          "id": 126,
          "label": "50mm角",
          "price_diff": 0,
          "description": "コンパクト",
          "sort_order": 1
        },
        {
          "id": 127,
          "label": "60mm角",
          "price_diff": 2000,
          "description": "標準サイズ",
          "sort_order": 2
        },
        {
          "id": 128,
          "label": "80mm角",
          "price_diff": 6000,
          "description": "存在感あり",
          "sort_order": 3
        }
      ]
    }
  ]
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| product_id | string | 商品ID |
| options | array | オプション一覧 |
| options[].id | number | オプションID |
| options[].name | string | オプション名 |
| options[].is_required | boolean | 必須フラグ |
| options[].sort_order | number | 並び順 |
| options[].values | array | オプション値一覧 |
| options[].values[].id | number | オプション値ID |
| options[].values[].label | string | ラベル |
| options[].values[].price_diff | number | 価格差分 |
| options[].values[].description | string \| null | 説明 |
| options[].values[].sort_order | number | 並び順 |

---

## 6. 関連商品取得

### `GET /api/products/{product_id}/related`

指定した商品の関連商品一覧を取得します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| product_id | string | ○ | 商品ID（パスパラメータ） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "product_id": "qr-cube",
  "related_products": [
    {
      "id": "logo-cutout",
      "name": "Logo Cutout Object",
      "name_ja": "ロゴカットアウト",
      "slug": "logo-cutout",
      "base_price": 12800,
      "main_image_url": "/images/products/logo-cutout-1.jpg"
    }
  ]
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| product_id | string | 商品ID |
| related_products | array | 関連商品一覧 |
| related_products[].id | string | 商品ID |
| related_products[].name | string | 英語名 |
| related_products[].name_ja | string | 日本語名 |
| related_products[].slug | string | URL用スラッグ |
| related_products[].base_price | number | 税抜基本価格 |
| related_products[].main_image_url | string \| null | メイン画像URL |

---

## エラーレスポンス

全エンドポイント共通のエラーレスポンス形式です。

```json
{
  "detail": "エラーメッセージ"
}
```

### 主なHTTPステータスコード

| コード | 説明 |
|--------|------|
| 400 | リクエスト不正（バリデーションエラー等） |
| 404 | 商品が見つからない、または非公開 |
| 422 | バリデーションエラー（Pydantic） |
| 500 | サーバーエラー |

---

## 関連ファイル

### バックエンド

- `backend/app/presentation/api/product_api.py` - APIエンドポイント定義
- `backend/app/presentation/schemas/product_schemas.py` - リクエスト/レスポンススキーマ
- `backend/app/application/use_cases/product_usecase.py` - ユースケース実装
- `backend/app/application/schemas/product_schemas.py` - アプリケーション層DTO
- `backend/app/domain/entities/product.py` - ドメインエンティティ
- `backend/app/domain/repositories/product_repository.py` - リポジトリインターフェース
- `backend/app/infrastructure/db/repositories/product_repository_impl.py` - リポジトリ実装
- `backend/app/infrastructure/db/models/product_model.py` - DBモデル
