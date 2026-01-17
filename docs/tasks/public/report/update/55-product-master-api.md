# Product Master API 実装レポート

## 概要

商品マスタ（形状テンプレート）のAPIエンドポイントを実装。
公開API（1エンドポイント）と管理者API（3エンドポイント）を追加。

## 関連ドキュメント

- API設計: `docs/requirements/13-API設計.md`
- データベース設計: `docs/requirements/12-データベース設計.md`
- バックエンド実装レポート: `docs/tasks/public/report/update/53-product-master-introduction.md`

---

## 実装したエンドポイント

### 公開API

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/masters` | 商品マスタ一覧（有効なもののみ） |

### Admin API

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/masters` | 商品マスタ一覧（全件、フィルタ可能） |
| POST | `/api/admin/masters` | 商品マスタ作成 |
| PUT | `/api/admin/masters/{id}` | 商品マスタ更新 |

---

## レスポンス例

### GET `/api/masters`

```json
{
  "masters": [
    {
      "id": "canvas",
      "name": "キャンバス",
      "name_en": "The Canvas",
      "model_category": "signature",
      "tagline": "迷ったらこれ。最も美しい比率のアクリルアート。",
      "description": "A2〜A5の定型規格サイズで展開する...",
      "base_lead_time_days": 7
    }
  ],
  "total": 14
}
```

### POST `/api/admin/masters`

**リクエスト:**
```json
{
  "id": "new-shape",
  "name": "新形状",
  "name_en": "New Shape",
  "model_category": "standard",
  "tagline": "新しい形状です",
  "description": "詳細説明...",
  "base_lead_time_days": 7,
  "is_active": true,
  "sort_order": 0
}
```

**レスポンス:**
```json
{
  "id": "new-shape",
  "name": "新形状",
  "name_en": "New Shape",
  "model_category": "standard",
  "tagline": "新しい形状です",
  "description": "詳細説明...",
  "base_lead_time_days": 7,
  "is_active": true,
  "sort_order": 0,
  "created_at": "2026-01-17T12:00:00",
  "updated_at": "2026-01-17T12:00:00"
}
```

---

## ファイル構成

### 新規作成ファイル（11ファイル）

```
backend/app/
├── application/
│   ├── schemas/
│   │   ├── catalog/product_master_schemas.py    # 公開API用DTO
│   │   └── admin/admin_product_master_schemas.py # Admin用DTO
│   └── use_cases/
│       ├── catalog/product_master_usecase.py    # 公開API用Usecase
│       └── admin/admin_product_master_usecase.py # Admin用Usecase
├── presentation/
│   ├── schemas/
│   │   ├── catalog/product_master_schemas.py    # 公開API用Request/Response
│   │   └── admin/admin_product_master_schemas.py # Admin用Request/Response
│   └── api/
│       ├── catalog/product_master_api.py        # 公開APIエンドポイント
│       └── admin/admin_product_master_api.py    # AdminAPIエンドポイント
├── di/
│   ├── catalog/product_master.py                # 公開API用DI
│   └── admin/admin_product_master.py            # Admin用DI
└── main.py                                      # ルーター登録（更新）
```

### 既存ファイル（参照のみ）

| ファイル | 用途 |
|----------|------|
| `domain/entities/product_master.py` | エンティティ |
| `domain/repositories/product_master_repository.py` | リポジトリIF |
| `infrastructure/db/models/product_master_model.py` | DBモデル |
| `infrastructure/db/repositories/product_master_repository_impl.py` | リポジトリ実装 |

---

## クエリパラメータ

### GET `/api/admin/masters`

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `model_category` | string | モデルカテゴリでフィルタ（signature/standard/free-cut/structure） |
| `is_active` | boolean | 有効状態でフィルタ |

---

## 動作確認

```bash
# 公開API
curl http://localhost:8005/api/masters
# → 14件の有効なマスタを取得

# Admin API（認証なし）
curl http://localhost:8005/api/admin/masters
# → {"detail":"管理者認証が必要です"}
```

---

## 備考

- API設計書に記載のDELETEエンドポイントは未実装（仕様上不要のため）
- 商品マスタは頻繁に変更しないため、シードデータで管理も可能
- 公開APIは`is_active=true`のマスタのみ返却
