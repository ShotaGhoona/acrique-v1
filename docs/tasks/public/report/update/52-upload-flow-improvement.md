# 入稿フロー改善 実装レポート

## 概要

チェックアウト時の入稿フローを要件定義（21-data-upload-flow.md）に合わせて改善する。
注文ステータスの整理、`quantity_index` カラムの追加、およびフロントエンドのリファクタリングを実施。

## 関連ドキュメント

- 実装戦略書: `docs/tasks/public/strategy/15-upload-flow-improvement.md`
- 要件定義: `docs/requirements/21-data-upload-flow.md`

---

## 作業ログ

### 2026-01-11: Phase 1 - ステータス変更・DB修正

**目的**: 注文ステータスを9種類から8種類に整理し、`quantity_index` カラムを追加

#### 1. Backend: OrderStatus enum 更新

**変更ファイル**: `backend/app/domain/entities/order.py`

| Before | After |
|--------|-------|
| `pending` | `pending`（支払い待ち）|
| `awaiting_payment` | **削除** |
| `paid` | **削除** |
| `awaiting_data` | **削除** |
| `data_reviewing` | `reviewing`（入稿審査中）|
| - | `revision_required`（再入稿待ち）**新規** |
| `confirmed` | `confirmed`（製作待ち）|
| `processing` | `processing`（製作中）|
| `shipped` | `shipped`（発送済み）|
| `delivered` | `delivered`（完了）|
| `cancelled` | `cancelled`（キャンセル）|

**削除の理由**:
- `awaiting_payment`: `pending` に統合（未支払いは全て pending）
- `paid`: 不要（`paid_at` で記録）
- `awaiting_data`: 削除（チェックアウト時は入稿必須なので発生しない）

---

#### 2. Backend: 関連コード修正

| レイヤー | ファイル | 変更内容 |
|----------|----------|----------|
| Domain | `app/domain/entities/order.py` | `OrderStatus` enum 更新、`can_cancel()` 修正 |
| Application | `app/application/use_cases/payment_usecase.py` | 支払い成功時のステータス遷移を `REVIEWING` に変更 |
| Application | `app/application/use_cases/upload_usecase.py` | 入稿紐付け時のステータス条件を `REVISION_REQUIRED` に変更 |
| Application | `app/application/use_cases/admin_order_usecase.py` | ステータス遷移検証ロジック更新 |
| Infrastructure | `app/infrastructure/db/repositories/order_repository_impl.py` | 各種統計クエリ（`get_pending_count`, `get_stats` 等）更新 |
| Infrastructure | `app/infrastructure/db/seeds/order_seed.py` | テストデータ更新 |

---

#### 3. Backend: Upload エンティティ拡張

**変更ファイル**:

| ファイル | 変更内容 |
|----------|----------|
| `app/domain/entities/upload.py` | `quantity_index: int = Field(1, ...)` 追加 |
| `app/infrastructure/db/models/upload_model.py` | `quantity_index = Column(Integer, nullable=False, default=1)` 追加 |

---

#### 4. Backend: マイグレーション作成

**作成ファイル**: `alembic/versions/e2f4a5b6c7d8_add_quantity_index_and_update_status.py`

```python
def upgrade() -> None:
    # 1. uploads テーブルに quantity_index カラムを追加
    op.add_column(
        'uploads',
        sa.Column('quantity_index', sa.Integer(), nullable=False, server_default='1'),
    )

    # 2. インデックス追加
    op.create_index(
        'ix_uploads_order_item_quantity',
        'uploads',
        ['order_item_id', 'quantity_index'],
    )

    # 3. orders テーブルのステータス値を移行
    op.execute(
        "UPDATE orders SET status = 'reviewing' WHERE status = 'data_reviewing'"
    )
    op.execute(
        "UPDATE orders SET status = 'pending' WHERE status IN ('awaiting_payment', 'paid', 'awaiting_data')"
    )
```

**デプロイ時のコマンド**: `alembic upgrade head`

---

#### 5. Frontend: 型定義更新

**変更ファイル**: `frontend/src/shared/domain/order/model/types.ts`

```typescript
export type OrderStatus =
  | 'pending'
  | 'reviewing'
  | 'revision_required'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
```

---

#### 6. Frontend: UI コンポーネント更新

**更新したファイル（8ファイル）**:

| ファイル | 変更内容 |
|----------|----------|
| `mypage/order-upload/ui/OrderUploadContainer.tsx` | statusLabels, canUpload ロジック更新 |
| `mypage/order-detail/ui/OrderDetailContainer.tsx` | statusLabels, statusVariants, statusIcons, Timeline, canCancel 更新 |
| `mypage/orders-home/ui/OrdersHomeContainer.tsx` | statusLabels, statusVariants, filterOptions 更新 |
| `mypage/home/ui/MypageHomeContainer.tsx` | statusLabels, statusVariants, OrderStatusSummary 更新 |
| `admin/users/detail/ui/UserDetailContainer.tsx` | orderStatusLabels 更新 |
| `admin/orders/home/ui/OrdersHomeContainer.tsx` | orderStatusLabels, orderStatusColors 更新 |
| `admin/orders/detail/ui/OrderDetailContainer.tsx` | orderStatusLabels, orderStatusColors 更新 |
| `admin/dashboard/ui/DashboardContainer.tsx` | statusLabels, statusVariants 更新 |

---

#### 7. Frontend: Upload 型拡張

**変更ファイル**: `frontend/src/entities/upload/model/types.ts`

```typescript
export interface Upload {
  // ... 既存フィールド
  quantity_index: number;  // 追加
}
```

---

### 2026-01-11: ステータス定数リファクタリング

**目的**: 各コンポーネントに散らばっていたステータス定数を共通化

**作成ファイル**: `frontend/src/shared/domain/order/model/types.ts`

**追加した定数**:

| 定数名 | 用途 |
|--------|------|
| `ORDER_STATUS_LABELS` | ユーザー向けステータスラベル |
| `ORDER_STATUS_VARIANTS` | ユーザー向け Badge 色 |
| `ADMIN_ORDER_STATUS_LABELS` | 管理者向けステータスラベル |
| `ADMIN_ORDER_STATUS_VARIANTS` | 管理者向け Badge 色 |
| `PROCESSING_STATUSES` | 処理中とみなすステータス一覧 |

**リファクタリング内容**:

| Before | After |
|--------|-------|
| 各ファイルで `const statusLabels = {...}` を定義 | `import { ORDER_STATUS_LABELS } from '@/shared/domain/order/model/types'` |
| 各ファイルで `const statusVariants = {...}` を定義 | `import { ORDER_STATUS_VARIANTS } from '@/shared/domain/order/model/types'` |
| Admin 用も同様に個別定義 | `ADMIN_ORDER_STATUS_LABELS`, `ADMIN_ORDER_STATUS_VARIANTS` を import |

**削除した重複コード**: 各ファイルから約20〜30行の定数定義を削除

---

## 次のステップ

### Phase 1: DB・ステータス

| タスク | 状況 |
|--------|------|
| OrderStatus enum 更新（Backend） | [x] |
| マイグレーション: quantity_index 追加 | [x] |
| マイグレーション: ステータス値移行 | [x] |
| Upload エンティティ修正 | [x] |
| Frontend 型定義更新 | [x] |
| Frontend UI コンポーネント更新 | [x] |
| ステータス定数リファクタリング | [x] |

### Phase 2: Backend API（未実装）

| タスク | 状況 |
|--------|------|
| OrderItemDTO に requires_upload 追加 | [ ] |
| order_usecase.py 修正 | [ ] |
| 紐付け API に quantity_index 対応 | [ ] |
| payment_usecase.py ステータス決定ロジック更新 | [ ] |
| Admin 審査 API（approve/reject） | [ ] |

### Phase 3: Frontend（未実装）

| タスク | 状況 |
|--------|------|
| OrderItem 型に requires_upload 追加 | [ ] |
| CheckoutContainer 分岐ロジック | [ ] |
| CheckoutUploadContainer 全面改修 | [ ] |
| 入稿完了バリデーション | [ ] |
| useLinkUploads フック修正 | [ ] |

### Phase 4: マイページ・Admin（未実装）

| タスク | 状況 |
|--------|------|
| マイページ再入稿画面 | [ ] |
| Admin 審査画面の承認/差し戻し実装 | [ ] |
| 差し戻し理由入力 | [ ] |

---

## 注意事項

- **後方互換性は不要**: ECサイトは未運用のため、レガシーコードは全て削除済み
- 古いステータス（`awaiting_payment`, `paid`, `awaiting_data`, `data_reviewing`）は完全削除
- デプロイ時は `alembic upgrade head` の実行が必要
