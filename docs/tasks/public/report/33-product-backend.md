# Product Backend 実装レポート

## 概要

商品関連のバックエンドAPIを実装。オニオンアーキテクチャに従い、商品一覧・詳細・検索・オプション・関連商品の取得機能を構築した。

---

## 実装したAPI

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/products` | 商品一覧（フィルタ/ページング対応） |
| GET | `/api/products/featured` | おすすめ商品 |
| GET | `/api/products/search` | 商品検索 |
| GET | `/api/products/{id}` | 商品詳細 |
| GET | `/api/products/{id}/options` | 商品オプション一覧 |
| GET | `/api/products/{id}/related` | 関連商品 |

---

## アーキテクチャ

### Domain層

**エンティティ:**

| ファイル | 説明 |
|----------|------|
| `app/domain/entities/product.py` | Product, ProductImage, ProductOption, ProductOptionValue, ProductSpec, ProductFeature, ProductFaq, ProductRelation |

**リポジトリインターフェース:**

| ファイル | 説明 |
|----------|------|
| `app/domain/repositories/product_repository.py` | 商品リポジトリIF（CRUD + 関連データ操作） |

### Application層

**UseCase:**

| ファイル | 説明 |
|----------|------|
| `app/application/use_cases/product_usecase.py` | 商品ユースケース（一覧/詳細/検索/オプション/関連） |

**スキーマ（DTO）:**

| ファイル | 説明 |
|----------|------|
| `app/application/schemas/product_schemas.py` | 入出力DTO |

### Infrastructure層

**DBモデル:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/models/product_model.py` | ProductModel, ProductImageModel, ProductOptionModel, ProductOptionValueModel, ProductSpecModel, ProductFeatureModel, ProductFaqModel, ProductRelationModel |

**リポジトリ実装:**

| ファイル | 説明 |
|----------|------|
| `app/infrastructure/db/repositories/product_repository_impl.py` | 商品リポジトリ実装 |

### Presentation層

| ファイル | 説明 |
|----------|------|
| `app/presentation/api/product_api.py` | APIエンドポイント |
| `app/presentation/schemas/product_schemas.py` | リクエスト/レスポンススキーマ |

### DI層

| ファイル | 説明 |
|----------|------|
| `app/di/product.py` | 依存性注入設定 |

---

## DBスキーマ

### products テーブル

```sql
CREATE TABLE products (
    id VARCHAR(100) PRIMARY KEY,  -- qr-cube等
    category_id VARCHAR(50) NOT NULL,  -- shop/office/you
    name VARCHAR(200) NOT NULL,  -- 英語名
    name_ja VARCHAR(200) NOT NULL,  -- 日本語名
    slug VARCHAR(200) UNIQUE,  -- URL用
    tagline VARCHAR(255),  -- キャッチコピー
    description TEXT,  -- 短い説明
    long_description TEXT,  -- 詳細説明
    base_price INT NOT NULL,  -- 税抜基本価格
    price_note VARCHAR(255),  -- 価格補足
    lead_time_days INT,  -- 標準納期
    lead_time_note VARCHAR(255),  -- 納期補足
    requires_upload BOOLEAN DEFAULT false,  -- 入稿必須
    upload_type VARCHAR(50),  -- logo/qr/photo/text
    upload_note TEXT,  -- 入稿時の注意
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_slug ON products(slug);
```

### product_images テーブル

```sql
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    url VARCHAR(500) NOT NULL,
    alt VARCHAR(255),
    is_main BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
```

### product_options テーブル

```sql
CREATE TABLE product_options (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    name VARCHAR(100) NOT NULL,  -- サイズ/厚み等
    is_required BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_product_options_product ON product_options(product_id);
```

### product_option_values テーブル

```sql
CREATE TABLE product_option_values (
    id SERIAL PRIMARY KEY,
    option_id INT NOT NULL REFERENCES product_options(id),
    label VARCHAR(100) NOT NULL,  -- 50mm角
    price_diff INT DEFAULT 0,  -- 価格差分
    description VARCHAR(255),
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_product_option_values_option ON product_option_values(option_id);
```

### product_specs テーブル

```sql
CREATE TABLE product_specs (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    label VARCHAR(100) NOT NULL,
    value VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_product_specs_product ON product_specs(product_id);
```

### product_features テーブル

```sql
CREATE TABLE product_features (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_product_features_product ON product_features(product_id);
```

### product_faqs テーブル

```sql
CREATE TABLE product_faqs (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_product_faqs_product ON product_faqs(product_id);
```

### product_relations テーブル

```sql
CREATE TABLE product_relations (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    related_product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_product_relations_product ON product_relations(product_id);
CREATE INDEX idx_product_relations_related ON product_relations(related_product_id);
```

---

## APIレスポンス例

### GET /api/products

```json
{
  "products": [
    {
      "id": "qr-cube",
      "category_id": "shop",
      "name": "QR Cube",
      "name_ja": "QRキューブ",
      "slug": "qr-cube",
      "tagline": "店舗のQRコードをスタイリッシュに",
      "base_price": 8800,
      "price_note": "税抜",
      "is_featured": true,
      "main_image_url": "/images/products/qr-cube-01.jpg",
      "images": [...]
    }
  ],
  "total": 12,
  "limit": 20,
  "offset": 0
}
```

### GET /api/products/{id}

```json
{
  "id": "qr-cube",
  "category_id": "shop",
  "name": "QR Cube",
  "name_ja": "QRキューブ",
  "slug": "qr-cube",
  "tagline": "店舗のQRコードをスタイリッシュに",
  "description": "...",
  "long_description": "...",
  "base_price": 8800,
  "price_note": "税抜",
  "lead_time_days": 7,
  "lead_time_note": "営業日",
  "requires_upload": true,
  "upload_type": "qr",
  "upload_note": "QRコードのURLを入力してください",
  "is_featured": true,
  "images": [...],
  "options": [
    {
      "id": 1,
      "name": "サイズ",
      "is_required": true,
      "sort_order": 0,
      "values": [
        {"id": 1, "label": "50mm角", "price_diff": 0, "description": "コンパクト"},
        {"id": 2, "label": "80mm角", "price_diff": 2000, "description": "存在感"}
      ]
    }
  ],
  "specs": [...],
  "features": [...],
  "faqs": [...],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

---

## クエリパラメータ

### GET /api/products

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| category_id | string | null | カテゴリフィルタ (shop/office/you) |
| is_featured | boolean | null | おすすめ商品のみ |
| limit | int | 20 | 取得件数 (1-100) |
| offset | int | 0 | オフセット |

### GET /api/products/search

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| keyword | string | 必須 | 検索キーワード |
| category_id | string | null | カテゴリフィルタ |
| limit | int | 20 | 取得件数 |
| offset | int | 0 | オフセット |

---

## テスト結果

| Endpoint | Method | Status | 結果 |
|----------|--------|--------|------|
| /api/products | GET | 200 | 成功 |
| /api/products/featured | GET | 200 | 成功 |
| /api/products/search?keyword=test | GET | 200 | 成功 |
| /api/products/{id} | GET | 404 | 存在しない商品で想定通りのエラー |
| /api/products/{id}/options | GET | 404 | 存在しない商品で想定通りのエラー |
| /api/products/{id}/related | GET | 404 | 存在しない商品で想定通りのエラー |

---

## マイグレーション

```bash
# 実行済み
docker exec acrique-v1-backend-1 alembic revision --autogenerate -m "add product tables"
docker exec acrique-v1-backend-1 alembic upgrade head
```

マイグレーションファイル: `alembic/versions/0187dde0e7d8_add_product_tables.py`

---

## 次のステップ

1. **Admin API実装** - 商品の登録・編集・削除機能
2. **商品データ投入** - 初期商品データの登録
3. **フロントエンド連携** - 商品一覧・詳細ページとの接続
4. **画像アップロード** - S3連携による商品画像管理
