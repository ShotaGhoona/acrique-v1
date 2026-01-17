# Product Master フロントエンド対応 実装レポート

## 概要

バックエンドで導入された `product_master` テーブルと `production_type` に対応するため、フロントエンドの型定義を更新。
従来の `requires_upload`, `upload_type`, `upload_note` フィールドを削除し、新しい `master_id`, `production_type`, `upload_requirements` フィールドに移行。

## 関連ドキュメント

- バックエンド実装レポート: `docs/tasks/public/report/update/53-product-master-introduction.md`
- 要件定義: `docs/requirements/22-product-master-update.md`

---

## 変更サマリ

| 項目 | 旧 | 新 |
|------|----|----|
| 入稿要否 | `requires_upload` (boolean) | `upload_requirements` の有無で判定 |
| 入稿タイプ | `upload_type` (string) | `upload_requirements.inputs` で定義 |
| 入稿備考 | `upload_note` (string) | `upload_requirements.inputs[].note` に統合 |
| 形状参照 | なし | `master_id` (string) |
| 製作タイプ | なし | `production_type` (standard/template/custom) |

---

## 作業ログ

### 2026-01-17: Phase 1 - 型定義の更新

#### 1. UploadRequirements 型の追加

**変更ファイル**: `frontend/src/shared/domain/upload/model/types.ts`

```typescript
// 追加された型定義
export type UploadInputType = 'text' | 'url' | 'date' | 'file';

export interface UploadInputBase {
  type: UploadInputType;
  key: string;
  label: string;
  required: boolean;
}

export interface UploadInputText extends UploadInputBase {
  type: 'text';
  placeholder?: string;
  maxLength?: number;
}

export interface UploadInputUrl extends UploadInputBase {
  type: 'url';
  placeholder?: string;
}

export interface UploadInputDate extends UploadInputBase {
  type: 'date';
}

export interface UploadInputFile extends UploadInputBase {
  type: 'file';
  accept: string;
  maxSizeMB?: number;
  note?: string;
}

export type UploadInput =
  | UploadInputText
  | UploadInputUrl
  | UploadInputDate
  | UploadInputFile;

export interface UploadRequirementsData {
  inputs: UploadInput[];
}

export type UploadRequirements = UploadRequirementsData | null;
```

---

#### 2. catalog-domain/product 型定義の更新

**変更ファイル**: `frontend/src/entities/catalog-domain/product/model/types.ts`

| Before | After |
|--------|-------|
| `requires_upload: boolean` | **削除** |
| `upload_type: string \| null` | **削除** |
| `upload_note: string \| null` | **削除** |
| - | `master_id: string \| null` |
| - | `production_type: ProductionType` |
| - | `upload_requirements: UploadRequirements` |

**追加された型**:
```typescript
export type ProductionType = 'standard' | 'template' | 'custom';
```

---

#### 3. admin-domain/admin-product 型定義の更新

**変更ファイル**: `frontend/src/entities/admin-domain/admin-product/model/types.ts`

**AdminProductDetail**:
| Before | After |
|--------|-------|
| `requires_upload: boolean` | **削除** |
| `upload_type: string \| null` | **削除** |
| `upload_note: string \| null` | **削除** |
| - | `master_id: string \| null` |
| - | `production_type: ProductionType` |
| - | `upload_requirements: UploadRequirements` |

**CreateProductRequest / UpdateProductRequest**:
同様の変更を適用。

---

#### 4. checkout-domain/order 型定義の更新

**変更ファイル**: `frontend/src/entities/checkout-domain/order/model/types.ts`

**OrderItem**:
| Before | After |
|--------|-------|
| `requires_upload: boolean` | **削除** |
| `upload_type: UploadType \| null` | **削除** |
| - | `upload_requirements: UploadRequirements` |

---

#### 5. feature層 フォーム型定義の更新

**変更ファイル**:
- `frontend/src/features/admin-domain/admin-product/create-product/model/types.ts`
- `frontend/src/features/admin-domain/admin-product/update-product/model/types.ts`

**CreateProductFormData / BasicInfoFormData**:
| Before | After |
|--------|-------|
| `requires_upload: boolean` | **削除** |
| `upload_type: string` | **削除** |
| `upload_note: string` | **削除** |
| - | `master_id: string` |
| - | `production_type: ProductionType` |
| - | `upload_requirements: UploadRequirements` |

---

## ファイル一覧

### 変更ファイル（6ファイル）

| ファイル | 変更内容 |
|----------|----------|
| `src/shared/domain/upload/model/types.ts` | UploadRequirements 型追加 |
| `src/entities/catalog-domain/product/model/types.ts` | ProductDetail 型更新、ProductionType 追加 |
| `src/entities/admin-domain/admin-product/model/types.ts` | AdminProductDetail, Request 型更新 |
| `src/entities/checkout-domain/order/model/types.ts` | OrderItem 型更新 |
| `src/features/admin-domain/admin-product/create-product/model/types.ts` | CreateProductFormData 更新 |
| `src/features/admin-domain/admin-product/update-product/model/types.ts` | BasicInfoFormData 更新 |

---

## 次のステップ

| タスク | 状況 |
|--------|------|
| 型定義の更新（entity層） | ✅ 完了 |
| 型定義の更新（feature層） | ✅ 完了 |
| page-components の修正 | ✅ 完了 |
| - ProductPreviewSheet.tsx | ✅ 完了 |
| - ProductEditContainer.tsx | ✅ 完了 |
| - BasicInfoTab.tsx | ✅ 完了 |
| - ProductNewContainer.tsx | ✅ 完了 |
| - CheckoutUploadContainer.tsx | ✅ 完了 |
| - CheckoutContainer.tsx | ✅ 完了 |
| - OrderUploadContainer.tsx | ✅ 完了 |
| RequirementsInputWidget 作成 | ✅ 完了 |

---

## 作業ログ（続き）

### 2026-01-17: Phase 2 - page-components の修正

#### 1. 管理画面 商品編集

**変更ファイル**:
- `src/page-components/admin/products/edit/ui/ProductEditContainer.tsx`
- `src/page-components/admin/products/edit/ui/components/ProductPreviewSheet.tsx`
- `src/page-components/admin/products/edit/ui/tab-components/BasicInfoTab.tsx`
- `src/page-components/admin/products/new/ui/ProductNewContainer.tsx`

| 変更内容 |
|----------|
| `requires_upload`, `upload_type`, `upload_note` フォームフィールドを削除 |
| `production_type` セレクト追加 |
| `upload_requirements` JSON入力追加（カスタム入稿設定） |

---

#### 2. チェックアウト入稿画面のリファクタリング

**変更ファイル**:
- `src/page-components/purchase/checkout-upload/ui/CheckoutUploadContainer.tsx`
- `src/page-components/purchase/checkout-upload/lib/types.ts`
- `src/page-components/purchase/checkout-upload/lib/upload-slot-utils.ts`

**新規作成ファイル**:
- `src/page-components/purchase/checkout-upload/ui/components/UploadSlotCard.tsx`
- `src/page-components/purchase/checkout-upload/ui/components/UploadProgressSidebar.tsx`

| Before | After |
|--------|-------|
| `UploadType` ベースの静的フォーム | `upload_requirements.inputs` ベースの動的フォーム |
| 巨大な単一コンポーネント | `UploadSlotCard`, `UploadProgressSidebar` に分割 |

**UploadSlot 型の変更**:
```typescript
// Before
interface UploadSlot {
  uploadType: UploadType;
  // ...
}

// After
interface UploadSlot {
  uploadRequirements: UploadRequirements;
  // ...
}
```

---

#### 3. マイページ再入稿画面のリファクタリング

**変更ファイル**:
- `src/page-components/mypage/order-upload/ui/OrderUploadContainer.tsx`

**新規作成ファイル**:
- `src/page-components/mypage/order-upload/ui/components/UploadItemCard.tsx`
- `src/page-components/mypage/order-upload/ui/components/ReUploadSlotCard.tsx`

| Before | After |
|--------|-------|
| `UploadType` ベースのファイルドロップゾーンのみ | `upload_requirements.inputs` ベースの動的フォーム |
| 商品から `upload_requirements` を取得 | `order_item` に保存された `upload_requirements` を使用 |

---

### 2026-01-17: Phase 3 - RequirementsInputWidget 作成

**目的**: 入稿要件に基づく動的フォームを共通化

**新規作成ファイル**:
- `src/widgets/purchase/requirements-input/ui/RequirementsInputWidget.tsx`
- `src/widgets/purchase/requirements-input/components/FileDropzone.tsx`
- `src/widgets/purchase/requirements-input/lib/file-utils.ts`

**削除ファイル**:
- `src/widgets/purchase/dynamic-input-field/` (全体)
- `src/widgets/purchase/dropzone/` (全体)
- `src/widgets/purchase/upload-input-form/` (未使用のため削除)

**RequirementsInputWidget の機能**:

| 入力タイプ | レンダリング |
|-----------|-------------|
| `text` | テキスト入力（maxLength対応） |
| `url` | URL入力（バリデーション付き） |
| `date` | 日付入力 |
| `file` | FileDropzone（ドラッグ＆ドロップ対応） |

---

## ファイル一覧

### 変更ファイル（20ファイル）

| ファイル | 変更内容 |
|----------|----------|
| `src/shared/domain/upload/model/types.ts` | UploadRequirements 型簡素化 |
| `src/entities/catalog-domain/product/model/types.ts` | ProductDetail 型更新 |
| `src/entities/admin-domain/admin-product/model/types.ts` | Admin型更新 |
| `src/entities/checkout-domain/order/model/types.ts` | OrderItem 型更新 |
| `src/entities/checkout-domain/upload/model/types.ts` | 旧UploadType削除 |
| `src/features/admin-domain/admin-product/create-product/model/types.ts` | フォーム型更新 |
| `src/features/admin-domain/admin-product/update-product/model/types.ts` | フォーム型更新 |
| `src/features/checkout-domain/upload/upload-file/lib/use-upload-file.ts` | hook更新 |
| `src/page-components/admin/products/edit/ui/ProductEditContainer.tsx` | 旧フィールド削除 |
| `src/page-components/admin/products/edit/ui/components/ProductPreviewSheet.tsx` | 旧フィールド削除 |
| `src/page-components/admin/products/edit/ui/tab-components/BasicInfoTab.tsx` | production_type対応 |
| `src/page-components/admin/products/new/ui/ProductNewContainer.tsx` | production_type対応 |
| `src/page-components/purchase/checkout-upload/lib/types.ts` | UploadSlot型変更 |
| `src/page-components/purchase/checkout-upload/lib/upload-slot-utils.ts` | ロジック更新 |
| `src/page-components/purchase/checkout-upload/ui/CheckoutUploadContainer.tsx` | リファクタリング |
| `src/page-components/purchase/checkout/ui/CheckoutContainer.tsx` | 判定ロジック変更 |
| `src/page-components/mypage/order-upload/ui/OrderUploadContainer.tsx` | リファクタリング |

### 新規作成ファイル（7ファイル）

| ファイル | 説明 |
|----------|------|
| `src/page-components/purchase/checkout-upload/ui/components/UploadSlotCard.tsx` | 入稿スロットカード |
| `src/page-components/purchase/checkout-upload/ui/components/UploadProgressSidebar.tsx` | 進捗サイドバー |
| `src/page-components/mypage/order-upload/ui/components/UploadItemCard.tsx` | 再入稿商品カード |
| `src/page-components/mypage/order-upload/ui/components/ReUploadSlotCard.tsx` | 再入稿スロットカード |
| `src/widgets/purchase/requirements-input/ui/RequirementsInputWidget.tsx` | 動的入力Widget |
| `src/widgets/purchase/requirements-input/components/FileDropzone.tsx` | ファイルドロップゾーン |
| `src/widgets/purchase/requirements-input/lib/file-utils.ts` | ファイルユーティリティ |

### 削除ファイル

| ファイル | 理由 |
|----------|------|
| `src/widgets/purchase/dynamic-input-field/` | RequirementsInputWidgetに統合 |
| `src/widgets/purchase/dropzone/` | requirements-input/componentsに移動 |
| `src/widgets/purchase/upload-input-form/` | 未使用（デッドコード） |

---

## 入稿要否の判定方法

**旧:**
```typescript
const requiresUpload = product.requires_upload
```

**新:**
```typescript
const requiresUpload = product.upload_requirements !== null
// または
const requiresUpload = product.production_type !== 'standard'
```

---

## 注意事項

- **後方互換性は不要**: 旧フィールドは完全に削除
- `UploadType`（shared/domain/upload）は Upload エンティティ用であり、Product とは別物として残存
- `ProductionType` は `catalog-domain/product` で定義し、他の場所からインポート
- `order_item` に `upload_requirements` を保存することで、商品変更後も正しいフォームを表示可能
