# Product Master 導入 要件定義

## 概要

商品管理の柔軟性向上のため、`product_master`（形状テンプレート）と`production_type`（製作タイプ）を導入する。

---

## 要件変更サマリ

| 項目 | 旧 | 新 |
|------|----|----|
| 形状管理 | なし | `product_master` テーブルで形状を定義 |
| 製作タイプ | なし（暗黙的） | `production_type`: standard/template/custom |
| 入稿要否 | `requires_upload` (BOOLEAN) | `production_type !== 'standard'` で判定 |
| 入稿タイプ | `upload_type` (VARCHAR) | `upload_requirements` (JSONB) で柔軟に定義 |
| 入稿注意書き | `upload_note` (TEXT) | `upload_requirements.inputs[].note` に統合 |

---

## 背景・目的

### 課題
- 同じ形状（Canvas等）でも、ターゲットや製作方式によって別商品として展開したい
- 入稿要件が商品ごとに異なり、柔軟な定義が必要

### 解決策
- `product_master`: 形状の定義（製作視点）
- `products`: 販売商品の定義（販売視点）
- `production_type`: 製作タイプによる分類
- `upload_requirements`: 入稿要件をJSONBで柔軟に定義

---

## 要件変更詳細

### DB: products テーブル

| 旧カラム | 新カラム | 変更内容 |
|---------|---------|---------|
| - | `master_id` | 追加: product_master への FK |
| - | `production_type` | 追加: standard/template/custom |
| `requires_upload` | - | 削除: production_type で代替 |
| `upload_type` | `upload_requirements` | 変更: VARCHAR → JSONB |
| `upload_note` | - | 削除: upload_requirements に統合 |

### ロジック: 入稿要否判定

**旧:**
```typescript
const requiresUpload = product.requires_upload === true
```

**新:**
```typescript
const requiresUpload = product.production_type !== 'standard'
```

### ロジック: 入稿タイプ取得

**旧:**
```typescript
const uploadType = product.upload_type // 'logo' | 'qr' | 'photo' | 'text'
```

**新:**
```typescript
const inputs = product.upload_requirements?.inputs ?? []
// inputs から動的にフォーム生成
```

### API: products レスポンス

**旧:**
```json
{
  "id": "qr-cube",
  "requires_upload": true,
  "upload_type": "qr",
  "upload_note": "QRコードのURLを入力してください"
}
```

**新:**
```json
{
  "id": "shop-qr-stand",
  "master_id": "a-stand",
  "production_type": "template",
  "upload_requirements": {
    "inputs": [
      { "type": "url", "key": "qr_url", "label": "QRコードのURL", "required": true }
    ]
  }
}
```

---

## 変更内容

### 1. 新規テーブル: product_master

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(100) | PK（canvas, round等） |
| name | VARCHAR(200) | 日本語名 |
| name_en | VARCHAR(200) | 英語名 |
| model_category | VARCHAR(50) | signature/standard/free-cut/structure |
| tagline | VARCHAR(255) | キャッチコピー |
| description | TEXT | 説明 |
| base_lead_time_days | INT | 基準納期 |
| is_active | BOOLEAN | |
| sort_order | INT | |

### 2. products テーブル変更

**追加カラム:**
| Column | Type | Description |
|--------|------|-------------|
| master_id | VARCHAR(100) | FK → product_master |
| production_type | VARCHAR(50) | standard/template/custom |
| upload_requirements | JSONB | 入稿要件 |

**削除カラム:**
- `requires_upload`
- `upload_type`
- `upload_note`

---

## production_type 定義

| 値 | 意味 | 入稿 | 価格 |
|----|------|------|------|
| `standard` | 標準デザイン（固定） | なし | 安め |
| `template` | テンプレートカスタム | テキスト/URL入力 | 中間 |
| `custom` | フルカスタム | ファイル入稿 | 高め |

---

## upload_requirements 型定義

```typescript
type UploadRequirements = {
  inputs: UploadInput[]
} | null

type UploadInput =
  | { type: 'text'; key: string; label: string; required: boolean; placeholder?: string }
  | { type: 'url'; key: string; label: string; required: boolean }
  | { type: 'date'; key: string; label: string; required: boolean }
  | { type: 'file'; key: string; label: string; required: boolean; accept: string; note?: string }
```

---

## 入稿要否の判定

**旧:**
```typescript
const requiresUpload = product.requires_upload
```

**新:**
```typescript
const requiresUpload = product.production_type !== 'standard'
// または
const requiresUpload = product.upload_requirements !== null
```

---

## API変更

### 既存APIの変更（フィールド追加）
- `GET /api/products` - レスポンスに `master_id`, `production_type`, `upload_requirements` 追加
- `GET /api/products/{id}` - 同上
- `POST /api/admin/products` - リクエストに上記フィールド追加
- `PUT /api/admin/products/{id}` - 同上

### 新規API（任意）
- `GET /api/masters` - 形状マスタ一覧
- `GET /api/admin/masters` - 管理用マスタ一覧
- `POST /api/admin/masters` - マスタ追加
- `PUT /api/admin/masters/{id}` - マスタ更新

※ 形状マスタは頻繁に変更しないため、シードデータ管理でも可

---

## マイグレーション手順

### Step 1: 追加（既存カラム維持）
```sql
-- product_master テーブル作成
CREATE TABLE product_master (...);

-- products に新カラム追加
ALTER TABLE products ADD COLUMN master_id VARCHAR(100);
ALTER TABLE products ADD COLUMN production_type VARCHAR(50);
ALTER TABLE products ADD COLUMN upload_requirements JSONB;
```

### Step 2: データ移行
```sql
-- 既存データを新カラムに移行
UPDATE products SET
  production_type = CASE
    WHEN requires_upload = false THEN 'standard'
    WHEN upload_type IN ('text', 'url', 'qr') THEN 'template'
    ELSE 'custom'
  END,
  upload_requirements = CASE
    WHEN requires_upload = false THEN NULL
    ELSE jsonb_build_object('inputs', jsonb_build_array(...))
  END;
```

### Step 3: 旧カラム削除
```sql
ALTER TABLE products DROP COLUMN requires_upload;
ALTER TABLE products DROP COLUMN upload_type;
ALTER TABLE products DROP COLUMN upload_note;
```

---

## 影響範囲

### Backend
- Product エンティティ・型定義
- Product リポジトリ（CRUD）
- 入稿要否判定ロジック

### Frontend
- 商品詳細の型定義
- 入稿フォームの動的生成（upload_requirements から）
- Admin 商品編集フォーム

### 影響なし
- 注文フロー（ロジック変更のみ）
- 決済フロー
- カート機能

---

## 参考

詳細設計: `docs/tasks/public/strategy/product-idea/04-simple-product-master.md`
