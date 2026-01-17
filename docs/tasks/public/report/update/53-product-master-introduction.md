# Product Master 導入 実装レポート

## 概要

商品管理の柔軟性向上のため、`product_masters` テーブルと `production_type` を導入。
従来の `requires_upload`, `upload_type`, `upload_note` カラムを廃止し、`upload_requirements` (JSONB) で入稿要件を柔軟に管理できるように変更。

## 関連ドキュメント

- 実装計画: `~/.claude/plans/valiant-fluttering-marshmallow.md`
- 要件定義: `docs/requirements/53-product-master.md`

---

## 変更サマリ

| 項目 | 旧 | 新 |
|------|----|----|
| 形状管理 | なし | `product_masters` テーブル |
| 製作タイプ | なし | `production_type`: standard/template/custom |
| 入稿要否 | `requires_upload` (BOOLEAN) | `upload_requirements` の有無で判定 |
| 入稿タイプ | `upload_type` (VARCHAR) | `upload_requirements` (JSONB) 内で定義 |
| 入稿備考 | `upload_note` (VARCHAR) | `upload_requirements` (JSONB) 内で定義 |

---

## 作業ログ

### 2026-01-17: Phase 1 - マイグレーション作成

**目的**: `product_masters` テーブル作成と `products` テーブルへの新カラム追加

#### 1. product_masters テーブル作成

**作成ファイル**: `backend/alembic/versions/f3a4b5c6d7e8_add_product_master_table.py`

```python
def upgrade() -> None:
    op.create_table(
        'product_masters',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('name_en', sa.String(200), nullable=True),
        sa.Column('model_category', sa.String(50), nullable=True),
        sa.Column('tagline', sa.String(255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('base_lead_time_days', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()')),
    )
    op.create_index('ix_product_masters_model_category', 'product_masters', ['model_category'])
    op.create_index('ix_product_masters_is_active', 'product_masters', ['is_active'])
```

---

#### 2. products テーブルに新カラム追加 & 旧カラム削除

**作成ファイル**: `backend/alembic/versions/g4b5c6d7e8f9_add_product_master_columns_to_products.py`

**追加カラム**:

| カラム名 | 型 | 説明 |
|----------|-----|------|
| `master_id` | VARCHAR(100), FK | 商品マスタへの参照 |
| `production_type` | VARCHAR(20) | 製作タイプ (standard/template/custom) |
| `upload_requirements` | JSONB | 入稿要件（柔軟な構造） |

**削除カラム**:

| カラム名 | 理由 |
|----------|------|
| `requires_upload` | `upload_requirements` の有無で判定 |
| `upload_type` | `upload_requirements` 内で定義 |
| `upload_note` | `upload_requirements` 内で定義 |

---

### 2026-01-17: Phase 2 - Domain層

#### 1. ProductMaster エンティティ作成

**作成ファイル**: `backend/app/domain/entities/product_master.py`

```python
class ProductMaster(BaseModel):
    id: str = Field(..., description='マスタID (例: qr-cube-base)')
    name: str = Field(..., description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ (cube/stand/plate等)')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基本納期（日数）')
    is_active: bool = Field(default=True, description='有効状態')
    sort_order: int = Field(default=0, description='並び順')
    created_at: datetime | None = Field(None, description='作成日時')
    updated_at: datetime | None = Field(None, description='更新日時')
```

---

#### 2. Product エンティティ更新

**変更ファイル**: `backend/app/domain/entities/product.py`

| Before | After |
|--------|-------|
| `requires_upload: bool` | **削除** |
| `upload_type: str \| None` | **削除** |
| `upload_note: str \| None` | **削除** |
| - | `master_id: str \| None` |
| - | `production_type: str = 'standard'` |
| - | `upload_requirements: dict \| None` |

---

#### 3. リポジトリインターフェース作成

**作成ファイル**: `backend/app/domain/repositories/product_master_repository.py`

```python
class IProductMasterRepository(ABC):
    @abstractmethod
    def get_by_id(self, master_id: str) -> ProductMaster | None: ...

    @abstractmethod
    def get_all(self, only_active: bool = True) -> list[ProductMaster]: ...

    @abstractmethod
    def create(self, master: ProductMaster) -> ProductMaster: ...

    @abstractmethod
    def update(self, master: ProductMaster) -> ProductMaster: ...

    @abstractmethod
    def delete(self, master_id: str) -> bool: ...
```

---

### 2026-01-17: Phase 3 - Infrastructure層

#### 1. ProductMasterModel 作成

**作成ファイル**: `backend/app/infrastructure/db/models/product_master_model.py`

```python
class ProductMasterModel(Base):
    __tablename__ = 'product_masters'

    id = Column(String(100), primary_key=True)
    name = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=True)
    model_category = Column(String(50), nullable=True, index=True)
    # ... 他カラム

    # リレーション
    products = relationship('ProductModel', back_populates='master')
```

---

#### 2. ProductModel 更新

**変更ファイル**: `backend/app/infrastructure/db/models/product_model.py`

```python
from sqlalchemy.dialects.postgresql import JSONB

class ProductModel(Base):
    # ... 既存カラム

    # 新規追加
    master_id = Column(
        String(100),
        ForeignKey('product_masters.id', ondelete='SET NULL'),
        nullable=True,
        index=True,
    )
    production_type = Column(String(20), nullable=False, default='standard', index=True)
    upload_requirements = Column(JSONB, nullable=True)

    # リレーション追加
    master = relationship('ProductMasterModel', back_populates='products')
```

---

#### 3. ProductRepositoryImpl 更新

**変更ファイル**: `backend/app/infrastructure/db/repositories/product_repository_impl.py`

| メソッド | 変更内容 |
|----------|----------|
| `_to_entity` | 新フィールド（master_id, production_type, upload_requirements）のマッピング追加 |
| `create` | 新フィールドの保存処理追加 |
| `update` | 新フィールドの更新処理追加 |

---

### 2026-01-17: Phase 4 - Application層

#### 1. Product Schemas 更新

**変更ファイル**: `backend/app/application/schemas/catalog/product_schemas.py`

| DTO | 追加フィールド |
|-----|---------------|
| `ProductDetailDTO` | `master_id`, `production_type`, `upload_requirements` |
| `ProductListItemDTO` | 変更なし（一覧では不要） |

---

#### 2. Admin Product Schemas 更新

**変更ファイル**: `backend/app/application/schemas/admin/admin_product_schemas.py`

| DTO | 追加フィールド |
|-----|---------------|
| `AdminProductCreateInputDTO` | `master_id`, `production_type`, `upload_requirements` |
| `AdminProductUpdateInputDTO` | `master_id`, `production_type`, `upload_requirements` |
| `AdminProductDTO` | `master_id`, `production_type`, `upload_requirements` |

---

#### 3. PaymentUsecase 更新（入稿要否判定ロジック）

**変更ファイル**: `backend/app/application/use_cases/checkout/payment_usecase.py`

```python
def _check_requires_upload(self, order) -> bool:
    """注文に入稿が必要な商品が含まれているかチェック

    upload_requirements がある商品は入稿が必要。
    """
    for item in order.items:
        product = self.product_repository.get_by_id(item.product_id)
        if product and product.upload_requirements:
            return True
    return False
```

**変更理由**: `product.needs_upload` プロパティは廃止し、`upload_requirements` の有無で直接判定。

---

### 2026-01-17: Phase 5 - Presentation層

#### 1. Product Schemas 更新

**変更ファイル**: `backend/app/presentation/schemas/catalog/product_schemas.py`

| Response | 追加フィールド |
|----------|---------------|
| `ProductDetailResponse` | `master_id`, `production_type`, `upload_requirements` |

---

#### 2. Admin Product Schemas 更新

**変更ファイル**: `backend/app/presentation/schemas/admin/admin_product_schemas.py`

| Schema | 追加フィールド |
|--------|---------------|
| `AdminProductCreateRequest` | `master_id`, `production_type`, `upload_requirements` |
| `AdminProductUpdateRequest` | `master_id`, `production_type`, `upload_requirements` |
| `AdminProductResponse` | `master_id`, `production_type`, `upload_requirements` |

---

### 2026-01-17: Phase 6 - 注文明細スキーマ更新

**目的**: `OrderItemDTO` から旧フィールドを削除し、`upload_requirements` に統一

#### 1. OrderItemDTO 更新

**変更ファイル**: `backend/app/application/schemas/checkout/order_schemas.py`

| Before | After |
|--------|-------|
| `requires_upload: bool` | **削除** |
| `upload_type: str \| None` | **削除** |
| - | `upload_requirements: dict \| None` |

---

#### 2. OrderItemResponse 更新

**変更ファイル**: `backend/app/presentation/schemas/checkout/order_schemas.py`

| Before | After |
|--------|-------|
| `requires_upload: bool` | **削除** |
| `upload_type: str \| None` | **削除** |
| - | `upload_requirements: dict \| None` |

---

#### 3. order_usecase.py 更新

**変更ファイル**: `backend/app/application/use_cases/checkout/order_usecase.py`

```python
# Before
requires_upload=product.requires_upload if product else False,
upload_type=product.upload_type if product else None,

# After
upload_requirements=product.upload_requirements if product else None,
```

---

#### 4. product_usecase.py 更新

**変更ファイル**: `backend/app/application/use_cases/catalog/product_usecase.py`

`needs_upload=product.needs_upload` 行を削除。

---

## 削除されたフィールド一覧

技術負債を残さないため、以下のフィールドを完全に削除：

| レイヤー | ファイル | 削除フィールド |
|----------|----------|---------------|
| Domain | `product.py` | `requires_upload`, `upload_type`, `upload_note`, `needs_upload` |
| Infrastructure | `product_model.py` | `requires_upload`, `upload_type`, `upload_note`（カラム） |
| Infrastructure | `product_repository_impl.py` | 同上（マッピング） |
| Application | `product_schemas.py` | `requires_upload`, `upload_type`, `upload_note`, `needs_upload`（DTO） |
| Application | `admin_product_schemas.py` | 同上（DTO） |
| Application | `order_schemas.py` | `requires_upload`, `upload_type`（OrderItemDTO） |
| Application | `product_usecase.py` | `needs_upload` マッピング |
| Application | `order_usecase.py` | `requires_upload`, `upload_type` マッピング |
| Presentation | `product_schemas.py` | `requires_upload`, `upload_type`, `upload_note`, `needs_upload`（Response） |
| Presentation | `admin_product_schemas.py` | 同上（Request/Response） |
| Presentation | `order_schemas.py` | `requires_upload`, `upload_type`（OrderItemResponse） |

---

## ファイル一覧

### 新規作成（7ファイル）

| ファイル | 説明 |
|----------|------|
| `alembic/versions/f3a4b5c6d7e8_add_product_master_table.py` | マイグレーション: product_masters テーブル |
| `alembic/versions/g4b5c6d7e8f9_add_product_master_columns_to_products.py` | マイグレーション: products 新カラム |
| `app/domain/entities/product_master.py` | ProductMaster エンティティ |
| `app/domain/repositories/product_master_repository.py` | リポジトリIF |
| `app/infrastructure/db/models/product_master_model.py` | DBモデル |
| `app/infrastructure/db/repositories/product_master_repository_impl.py` | リポジトリ実装 |

### 既存修正（14ファイル）

| ファイル | 変更内容 |
|----------|----------|
| `app/domain/entities/product.py` | 新フィールド追加、旧フィールド削除 |
| `app/infrastructure/db/models/product_model.py` | 新カラム、リレーション追加 |
| `app/infrastructure/db/repositories/product_repository_impl.py` | マッピング更新 |
| `app/application/schemas/catalog/product_schemas.py` | DTO更新 |
| `app/application/schemas/admin/admin_product_schemas.py` | Admin DTO更新 |
| `app/application/schemas/checkout/order_schemas.py` | OrderItemDTO更新 |
| `app/application/use_cases/catalog/product_usecase.py` | マッピング更新、`needs_upload`削除 |
| `app/application/use_cases/admin/admin_product_usecase.py` | create/update更新 |
| `app/application/use_cases/checkout/payment_usecase.py` | 入稿判定ロジック変更 |
| `app/application/use_cases/checkout/order_usecase.py` | OrderItemマッピング更新 |
| `app/presentation/schemas/catalog/product_schemas.py` | Response更新 |
| `app/presentation/schemas/admin/admin_product_schemas.py` | Request/Response更新 |
| `app/presentation/schemas/checkout/order_schemas.py` | OrderItemResponse更新 |

---

## 次のステップ

| タスク | 状況 |
|--------|------|
| マイグレーション作成 | ✅ 完了 |
| Domain層実装 | ✅ 完了 |
| Infrastructure層実装 | ✅ 完了 |
| Application層実装 | ✅ 完了 |
| Presentation層実装 | ✅ 完了 |
| マイグレーション実行 | ✅ 完了 |
| Seed データ更新 | ✅ 完了 |
| ProductMaster API 作成（任意） | [ ] 別タスク |
| Frontend 対応 | [ ] 別タスク |

---

## Seed データ更新（2026-01-17）

**変更ファイル**: `backend/app/infrastructure/db/seeds/product_seed.py`

### Product Masters（14種）

| ID | 名前 | カテゴリ | 説明 |
|----|------|----------|------|
| canvas | キャンバス | signature | A2〜A5の定型サイズアクリルアート |
| round | ラウンド | signature | 円形アクリル |
| arch | アーチ | signature | アーチ型アクリル |
| puzzle | パズル | signature | パズル型パネル |
| heart | ハート | signature | ハート型アクリル |
| silhouette | シルエット | free-cut | 自由形状カット |
| typography | タイポグラフィー | free-cut | 文字切り出し |
| logo | ロゴ | free-cut | ロゴ型切り出し |
| a-stand | Aスタンド | structure | A型スタンド |
| stage | ステージ | structure | 台座型ディスプレイ |
| square-stand | スクエアスタンド | structure | 正方形スタンド |
| cube | キューブ | structure | 立方体アクリル |
| plate | プレート | standard | サインプレート |
| display-case | ディスプレイケース | standard | アクリルケース |

### Products（20種）

| カテゴリ | 商品数 | production_type 内訳 |
|----------|--------|---------------------|
| shop | 6 | template: 3, custom: 2, standard: 1 |
| office | 6 | template: 3, custom: 2, standard: 1 |
| you | 8 | template: 4, custom: 3, standard: 1 |

### production_type と upload_requirements の対応

| production_type | 入稿形態 | upload_requirements |
|-----------------|----------|---------------------|
| `standard` | 入稿なし（既製デザイン） | `None` |
| `template` | テキスト/URL/日付入力のみ | inputs配列（file以外） |
| `custom` | ファイルアップロードあり | inputs配列（fileを含む） |

### upload_requirements 構造例

```python
# template型（QRコードキューブ）
{
    'inputs': [
        {'type': 'url', 'key': 'qr_url', 'label': 'QRコードのリンク先URL', 'required': True, 'placeholder': 'https://...'},
        {'type': 'text', 'key': 'label_text', 'label': '下部に表示するテキスト（任意）', 'required': False, 'maxLength': 30},
    ]
}

# custom型（ロゴカットアウト）
{
    'inputs': [
        {'type': 'file', 'key': 'logo_file', 'label': 'ロゴデータ', 'required': True, 'accept': '.ai,.eps,.pdf,.svg', 'maxSizeMB': 50, 'note': 'ベクターデータ推奨'},
    ]
}

# standard型
None
```

### 商品ID命名規則

旧: `qr-cube` → 新: `{category}-{master}-{variant}`

例:
- `shop-cube-qr` (shop × cube × QRコード)
- `office-plate-logo` (office × plate × ロゴ)
- `you-canvas-photo` (you × canvas × 写真)

---

## 残存する技術負債

**なし** - すべての旧フィールド参照を削除完了。

**注意**: Upload エンティティ（`upload.py`, `upload_model.py`等）の `upload_type` は Product とは別物であり、残す必要がある。

---

## 注意事項

- **後方互換性は不要**: dev環境のため旧カラムは完全削除
- `needs_upload` プロパティは作成せず、`upload_requirements` の有無で直接判定
- `production_type` のデフォルト値は `'standard'`（入稿不要）
- マイグレーション実行済み（2026-01-17）
