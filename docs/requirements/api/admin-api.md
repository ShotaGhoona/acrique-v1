# Admin API仕様書

## 概要

管理者向けAPIエンドポイント仕様です。すべてのエンドポイントにはAdmin認証（Cookie）が必要です。

---

## 認証API

Base URL: `/api/admin/auth`

### エンドポイント一覧

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| POST | `/login` | ログイン | 不要 |
| POST | `/logout` | ログアウト | 必要 |
| GET | `/status` | 認証状態確認 | 必要 |

---

### 1. ログイン

#### `POST /api/admin/auth/login`

管理者ログインを行います。成功時にHTTP Only Cookieが設定されます。

#### リクエスト

```json
{
  "email": "admin@acrique.jp",
  "password": "admin123"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| email | string | ○ | メールアドレス |
| password | string | ○ | パスワード |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "admin_id": 1,
  "name": "システム管理者",
  "role": "super_admin",
  "message": "ログインしました"
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| admin_id | number | 管理者ID |
| name | string | 管理者名 |
| role | string | ロール (super_admin / admin / editor) |
| message | string | メッセージ |

**エラー時 (401 Unauthorized)**

```json
{
  "detail": "メールアドレスまたはパスワードが正しくありません"
}
```

---

### 2. ログアウト

#### `POST /api/admin/auth/logout`

ログアウトを行います。Cookieが削除されます。

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "ログアウトしました"
}
```

---

### 3. 認証状態確認

#### `GET /api/admin/auth/status`

現在の認証状態を確認します。

#### レスポンス

**認証済み (200 OK)**

```json
{
  "is_authenticated": true,
  "admin_id": 1,
  "email": "admin@acrique.jp",
  "name": "システム管理者",
  "role": "super_admin"
}
```

**未認証 (401 Unauthorized)**

```json
{
  "detail": "認証されていません"
}
```

---

## 商品管理API

Base URL: `/api/admin/products`

### エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/` | 商品一覧取得 |
| POST | `/` | 商品作成 |
| GET | `/{product_id}` | 商品詳細取得 |
| PUT | `/{product_id}` | 商品更新 |
| DELETE | `/{product_id}` | 商品削除 |
| POST | `/{product_id}/images/presigned` | Presigned URL取得 |
| POST | `/{product_id}/images` | 画像追加 |
| PUT | `/{product_id}/images/{image_id}` | 画像更新 |
| DELETE | `/{product_id}/images/{image_id}` | 画像削除 |
| PUT | `/{product_id}/options` | オプション更新 |
| PUT | `/{product_id}/specs` | スペック更新 |
| PUT | `/{product_id}/features` | 特長更新 |
| PUT | `/{product_id}/faqs` | FAQ更新 |

---

### 1. 商品一覧取得

#### `GET /api/admin/products`

すべての商品（公開・非公開含む）を取得します。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| search | string | - | 商品名で検索 |
| category_id | string | - | カテゴリフィルタ |
| is_active | boolean | - | 公開状態フィルタ |
| limit | number | - | 取得件数（デフォルト: 20、最大: 100） |
| offset | number | - | オフセット（デフォルト: 0） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "products": [
    {
      "id": "qr-cube",
      "name": "QR Code Cube",
      "name_ja": "QRコードキューブ",
      "slug": "qr-cube",
      "tagline": "あなたのQRを、アートに。",
      "base_price": 8800,
      "category_id": "shop",
      "is_active": true,
      "is_featured": true,
      "sort_order": 1,
      "created_at": "2026-01-06T10:06:25.306628",
      "updated_at": "2026-01-06T10:06:25.306628",
      "main_image_url": "https://example.s3.amazonaws.com/products/xxx.jpg"
    }
  ],
  "total": 18,
  "limit": 20,
  "offset": 0
}
```

---

### 2. 商品作成

#### `POST /api/admin/products`

新規商品を作成します。

#### リクエスト

```json
{
  "id": "new-product",
  "name": "New Product",
  "name_ja": "新商品",
  "slug": "new-product",
  "tagline": "キャッチコピー",
  "description": "短い説明",
  "long_description": "詳細説明",
  "base_price": 10000,
  "price_note": "税抜",
  "category_id": "shop",
  "lead_time_days": 5,
  "lead_time_note": "5営業日〜",
  "requires_upload": false,
  "upload_type": null,
  "upload_note": null,
  "is_active": false,
  "is_featured": false,
  "sort_order": 0
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| id | string | ○ | 商品ID（英数字・ハイフン） |
| name | string | ○ | 英語名 |
| name_ja | string | - | 日本語名 |
| slug | string | ○ | URL用スラッグ |
| tagline | string | - | キャッチコピー |
| description | string | - | 短い説明 |
| long_description | string | - | 詳細説明 |
| base_price | number | ○ | 税抜基本価格 |
| price_note | string | - | 価格補足 |
| category_id | string | ○ | カテゴリID |
| lead_time_days | number | - | 標準納期（日数） |
| lead_time_note | string | - | 納期補足 |
| requires_upload | boolean | - | 入稿必須フラグ（デフォルト: false） |
| upload_type | string | - | 入稿タイプ |
| upload_note | string | - | 入稿時の注意 |
| is_active | boolean | - | 公開フラグ（デフォルト: false） |
| is_featured | boolean | - | おすすめフラグ（デフォルト: false） |
| sort_order | number | - | 並び順（デフォルト: 0） |

#### レスポンス

**成功時 (201 Created)**

```json
{
  "product": { /* 商品詳細オブジェクト */ },
  "message": "商品を作成しました"
}
```

---

### 3. 商品詳細取得

#### `GET /api/admin/products/{product_id}`

商品の詳細情報を取得します。

#### レスポンス

**成功時 (200 OK)**

```json
{
  "product": {
    "id": "qr-cube",
    "name": "QR Code Cube",
    "name_ja": "QRコードキューブ",
    "slug": "qr-cube",
    "tagline": "あなたのQRを、アートに。",
    "base_price": 8800,
    "category_id": "shop",
    "is_active": true,
    "is_featured": true,
    "sort_order": 1,
    "created_at": "2026-01-06T10:06:25.306628",
    "updated_at": "2026-01-06T10:06:25.306628",
    "main_image_url": "https://example.s3.amazonaws.com/products/xxx.jpg",
    "description": "短い説明",
    "long_description": "詳細説明",
    "price_note": "サイズ・オプションにより変動",
    "lead_time_days": 5,
    "lead_time_note": "5営業日〜",
    "requires_upload": true,
    "upload_type": "qr",
    "upload_note": "QRコードの画像データをお送りください",
    "images": [
      {
        "id": 118,
        "s3_url": "https://example.s3.amazonaws.com/products/xxx.jpg",
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
        "description": "10mm以上の厚みが生み出す重厚感。",
        "sort_order": 1
      }
    ],
    "faqs": [
      {
        "id": 37,
        "question": "QRコードのデータはどのように入稿すればよいですか？",
        "answer": "QRコードの画像データをお送りください。",
        "sort_order": 1
      }
    ]
  }
}
```

---

### 4. 商品更新

#### `PUT /api/admin/products/{product_id}`

商品の基本情報を更新します。指定したフィールドのみ更新されます。

#### リクエスト

```json
{
  "tagline": "新しいキャッチコピー",
  "is_active": true
}
```

すべてのフィールドはオプションです。

#### レスポンス

**成功時 (200 OK)**

```json
{
  "product": { /* 更新後の商品詳細オブジェクト */ },
  "message": "商品を更新しました"
}
```

---

### 5. 商品削除

#### `DELETE /api/admin/products/{product_id}`

商品を削除します。関連データ（画像、オプション等）も削除されます。

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "商品を削除しました"
}
```

---

## 画像管理API

### 6. Presigned URL取得

#### `POST /api/admin/products/{product_id}/images/presigned`

S3アップロード用のPresigned URLを取得します。

#### リクエスト

```json
{
  "file_name": "product-image.jpg",
  "content_type": "image/jpeg"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| file_name | string | ○ | ファイル名 |
| content_type | string | ○ | MIMEタイプ（image/jpeg, image/png, image/webp, image/gif） |

#### レスポンス

**成功時 (200 OK)**

```json
{
  "upload_url": "https://bucket.s3.amazonaws.com/products/xxx.jpg?X-Amz-...",
  "file_url": "https://bucket.s3.amazonaws.com/products/xxx.jpg",
  "expires_in": 3600
}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| upload_url | string | S3アップロード用URL（PUT） |
| file_url | string | アップロード後のファイルURL |
| expires_in | number | 有効期限（秒） |

---

### 7. 画像追加

#### `POST /api/admin/products/{product_id}/images`

S3にアップロード済みの画像をDBに登録します。

#### リクエスト

```json
{
  "s3_url": "https://bucket.s3.amazonaws.com/products/xxx.jpg",
  "alt": "商品画像",
  "is_main": false,
  "sort_order": 0
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| s3_url | string | ○ | S3画像URL |
| alt | string | - | 代替テキスト |
| is_main | boolean | - | メイン画像フラグ（デフォルト: false） |
| sort_order | number | - | 並び順（デフォルト: 0） |

#### レスポンス

**成功時 (201 Created)**

```json
{
  "image": {
    "id": 119,
    "s3_url": "https://bucket.s3.amazonaws.com/products/xxx.jpg",
    "alt": "商品画像",
    "is_main": false,
    "sort_order": 0
  },
  "message": "画像を追加しました"
}
```

---

### 8. 画像更新

#### `PUT /api/admin/products/{product_id}/images/{image_id}`

画像のメタデータを更新します。

#### リクエスト

```json
{
  "alt": "更新後の代替テキスト",
  "is_main": true,
  "sort_order": 1
}
```

すべてのフィールドはオプションです。

#### レスポンス

**成功時 (200 OK)**

```json
{
  "image": {
    "id": 119,
    "s3_url": "https://bucket.s3.amazonaws.com/products/xxx.jpg",
    "alt": "更新後の代替テキスト",
    "is_main": true,
    "sort_order": 1
  },
  "message": "画像を更新しました"
}
```

---

### 9. 画像削除

#### `DELETE /api/admin/products/{product_id}/images/{image_id}`

画像を削除します。S3からも削除されます。

#### レスポンス

**成功時 (200 OK)**

```json
{
  "message": "画像を削除しました"
}
```

---

## オプション・スペック・特長・FAQ管理API

### 10. オプション更新

#### `PUT /api/admin/products/{product_id}/options`

商品オプションを一括更新します。既存のオプションは削除され、新しいオプションに置き換えられます。

#### リクエスト

```json
{
  "options": [
    {
      "name": "サイズ",
      "is_required": true,
      "sort_order": 1,
      "values": [
        {
          "label": "50mm角",
          "price_diff": 0,
          "description": "コンパクト",
          "sort_order": 1
        },
        {
          "label": "60mm角",
          "price_diff": 2000,
          "description": "標準サイズ",
          "sort_order": 2
        }
      ]
    }
  ]
}
```

#### レスポンス

**成功時 (200 OK)**

```json
{
  "options": [
    {
      "id": 58,
      "name": "サイズ",
      "is_required": true,
      "sort_order": 1,
      "values": [
        {
          "id": 167,
          "label": "50mm角",
          "price_diff": 0,
          "description": "コンパクト",
          "sort_order": 1
        }
      ]
    }
  ],
  "message": "オプションを更新しました"
}
```

---

### 11. スペック更新

#### `PUT /api/admin/products/{product_id}/specs`

商品スペックを一括更新します。

#### リクエスト

```json
{
  "specs": [
    {
      "label": "素材",
      "value": "アクリル樹脂",
      "sort_order": 1
    }
  ]
}
```

#### レスポンス

**成功時 (200 OK)**

```json
{
  "specs": [
    {
      "id": 77,
      "label": "素材",
      "value": "アクリル樹脂",
      "sort_order": 1
    }
  ],
  "message": "スペックを更新しました"
}
```

---

### 12. 特長更新

#### `PUT /api/admin/products/{product_id}/features`

商品特長を一括更新します。

#### リクエスト

```json
{
  "features": [
    {
      "title": "高品質",
      "description": "最高品質の素材を使用しています。",
      "sort_order": 1
    }
  ]
}
```

#### レスポンス

**成功時 (200 OK)**

```json
{
  "features": [
    {
      "id": 49,
      "title": "高品質",
      "description": "最高品質の素材を使用しています。",
      "sort_order": 1
    }
  ],
  "message": "特長を更新しました"
}
```

---

### 13. FAQ更新

#### `PUT /api/admin/products/{product_id}/faqs`

商品FAQを一括更新します。

#### リクエスト

```json
{
  "faqs": [
    {
      "question": "納期はどのくらいですか？",
      "answer": "通常5営業日でお届けします。",
      "sort_order": 1
    }
  ]
}
```

#### レスポンス

**成功時 (200 OK)**

```json
{
  "faqs": [
    {
      "id": 49,
      "question": "納期はどのくらいですか？",
      "answer": "通常5営業日でお届けします。",
      "sort_order": 1
    }
  ],
  "message": "FAQを更新しました"
}
```

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
| 401 | 認証エラー（未ログイン） |
| 403 | 権限エラー |
| 404 | リソースが見つからない |
| 422 | バリデーションエラー（Pydantic） |
| 500 | サーバーエラー |

---

## 画像アップロードフロー

Presigned URL方式でのアップロード手順：

1. `POST /api/admin/products/{id}/images/presigned` でPresigned URL取得
2. 取得した`upload_url`に対してPUTリクエストでファイルをS3に直接アップロード
3. アップロード成功後、`POST /api/admin/products/{id}/images` で`file_url`をDBに登録

```javascript
// 1. Presigned URL取得
const { upload_url, file_url } = await getPresignedUrl(productId, {
  file_name: file.name,
  content_type: file.type
});

// 2. S3にアップロード
await fetch(upload_url, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});

// 3. DBに登録
await addImage(productId, {
  s3_url: file_url,
  alt: 'Image description',
  is_main: false,
  sort_order: 0
});
```

---

## 関連ファイル

### バックエンド

- `backend/app/presentation/api/admin_product_api.py` - APIエンドポイント定義
- `backend/app/presentation/api/admin_auth_api.py` - 認証APIエンドポイント
- `backend/app/presentation/schemas/admin_product_schemas.py` - リクエスト/レスポンススキーマ
- `backend/app/application/use_cases/admin_product_usecase.py` - ユースケース実装
- `backend/app/application/schemas/admin_product_schemas.py` - アプリケーション層DTO
- `backend/app/infrastructure/storage/s3_service.py` - S3サービス実装
- `backend/app/infrastructure/security/admin_security.py` - Admin認証処理
