# Product Frontend 実装レポート

## 概要

商品関連のフロントエンドを実装。Feature-Sliced Design（FSD）に従い、商品一覧・詳細・検索のAPI連携とUI構築を行った。ダミーデータからの完全移行を達成。

---

## 実装したページ

| パス | ページ | 説明 |
|------|--------|------|
| `/shop` | 店舗向けカテゴリ | 商品一覧 |
| `/office` | オフィス向けカテゴリ | 商品一覧 |
| `/you` | 個人向けカテゴリ | 商品一覧 |
| `/shop/{productId}` | 商品詳細 | 店舗向け商品詳細 |
| `/office/{productId}` | 商品詳細 | オフィス向け商品詳細 |
| `/you/{productId}` | 商品詳細 | 個人向け商品詳細 |
| `/admin/products` | 管理画面 | 商品一覧 |
| `/admin/products/new` | 管理画面 | 商品新規作成 |
| `/admin/products/{id}` | 管理画面 | 商品編集 |

---

## アーキテクチャ

### entities/product

**API:**

| ファイル | 説明 |
|----------|------|
| `entities/product/api/product-api.ts` | 商品API呼び出し |
| `entities/product/model/types.ts` | 型定義 |
| `entities/product/index.ts` | 公開エクスポート |

**API関数:**

```typescript
getProducts(params?: ProductListParams): Promise<ProductListResponse>
getProduct(productId: string): Promise<ProductDetail>
getFeaturedProducts(limit?: number): Promise<ProductListResponse>
searchProducts(params: ProductSearchParams): Promise<ProductSearchResponse>
getProductOptions(productId: string): Promise<ProductOptionsResponse>
getRelatedProducts(productId: string): Promise<ProductRelatedResponse>
```

**型定義:**

```typescript
// 商品一覧アイテム
interface ProductListItem {
  id: string;
  category_id: CategoryId;
  name: string;
  name_ja: string;
  slug: string | null;
  tagline: string | null;
  base_price: number;
  price_note: string | null;
  is_featured: boolean;
  main_image_url: string | null;
  images: ProductImage[];
}

// 商品詳細
interface ProductDetail {
  id: string;
  category_id: CategoryId;
  name: string;
  name_ja: string;
  // ... 全フィールド
  images: ProductImage[];
  options: ProductOption[];
  specs: ProductSpec[];
  features: ProductFeature[];
  faqs: ProductFaq[];
}
```

### features/product

| ディレクトリ | 説明 |
|--------------|------|
| `features/product/get-products/` | 商品一覧取得フック |
| `features/product/get-product/` | 商品詳細取得フック |
| `features/product/get-featured-products/` | おすすめ商品取得フック |
| `features/product/search-products/` | 商品検索フック |

**フック一覧:**

| フック | 用途 |
|--------|------|
| `useProducts(params?)` | 商品一覧取得 |
| `useProductsByCategory(categoryId, params?)` | カテゴリ別商品取得 |
| `useProduct(productId)` | 商品詳細取得 |
| `useProductOptions(productId)` | 商品オプション取得 |
| `useRelatedProducts(productId)` | 関連商品取得 |
| `useFeaturedProducts(limit?)` | おすすめ商品取得 |
| `useSearchProducts(params)` | 商品検索 |

### widgets

| ファイル | 変更内容 |
|----------|----------|
| `widgets/product/ui/ProductHeroSection.tsx` | 型をentities/productに変更 |
| `widgets/product/ui/ProductDetailsSection.tsx` | 型をentities/productに変更 |
| `widgets/product/ui/ProductOptionsSection.tsx` | 型をentities/productに変更 |
| `widgets/product/ui/ProductFAQSection.tsx` | 型をentities/productに変更 |
| `widgets/product/ui/RelatedProductsSection.tsx` | useRelatedProductsフック使用 |
| `widgets/home/ui/ProductsShowcaseSection.tsx` | useProductsByCategoryフック使用 |
| `widgets/category/ui/CategoryProductsSection.tsx` | 型をentities/productに変更 |
| `widgets/layout/ui/Header.tsx` | useProductsフック使用 |

### page-components

| ファイル | 変更内容 |
|----------|----------|
| `page-components/product/ProductPage.tsx` | 型をentities/productに変更 |
| `page-components/category/CategoryPage.tsx` | useProductsByCategoryフック使用 |
| `page-components/admin/products/home/` | useProductsフック使用 |
| `page-components/admin/products/new/` | ダミーデータ削除、型整備 |
| `page-components/admin/products/edit/` | useProductフック使用 |

### app routes

| ファイル | 変更内容 |
|----------|----------|
| `app/(public)/shop/[productId]/page.tsx` | useProductフック使用 |
| `app/(public)/office/[productId]/page.tsx` | useProductフック使用 |
| `app/(public)/you/[productId]/page.tsx` | useProductフック使用 |

---

## 削除したファイル

| ファイル | 理由 |
|----------|------|
| `page-components/admin/products/dummy-data/products.ts` | API化により不要 |

---

## バックエンド連携

| フロントエンド | バックエンドAPI |
|----------------|-----------------|
| 商品一覧 | `GET /api/products` |
| 商品詳細 | `GET /api/products/{id}` |
| おすすめ商品 | `GET /api/products/featured` |
| 商品検索 | `GET /api/products/search` |
| 商品オプション | `GET /api/products/{id}/options` |
| 関連商品 | `GET /api/products/{id}/related` |

---

## shared/domain/category との連携

カテゴリ情報は`shared/domain/category`から取得し、重複を防止。

```typescript
import type { CategoryId } from '@/shared/domain/category/model/types';
import { categories, getCategoryIds } from '@/shared/domain/category/data/categories';
```

**使用箇所:**
- `entities/product/model/types.ts` - ProductListItem.category_id
- `features/product/get-products/` - useProductsByCategory引数
- `widgets/home/ui/ProductsShowcaseSection.tsx`
- `widgets/layout/ui/Header.tsx`
- `page-components/admin/products/` - カテゴリ選択UI

---

## React Query設定

| 設定 | 値 |
|------|-----|
| `staleTime` | 5分 (`1000 * 60 * 5`) |
| `enabled` | IDがある場合のみ |

---

## 管理画面の状態

| 機能 | 状態 |
|------|------|
| 商品一覧表示 | API連携済み |
| 商品詳細表示 | API連携済み |
| 商品新規作成 | UI準備済み（API未実装） |
| 商品更新 | UI準備済み（API未実装） |
| 商品削除 | UI準備済み（API未実装） |
| 画像アップロード | 未実装 |

---

## コンポーネント構成

```
app/(public)/shop/[productId]/page.tsx
  └── page-components/product/ProductPage.tsx
        ├── widgets/product/ui/ProductHeroSection.tsx
        ├── widgets/product/ui/ProductDetailsSection.tsx
        ├── widgets/product/ui/ProductOptionsSection.tsx
        ├── widgets/product/ui/ProductFAQSection.tsx
        └── widgets/product/ui/RelatedProductsSection.tsx
              └── features/product/get-product/useRelatedProducts
```

---

## 使用コンポーネント

**shadcn/ui:**
- `Button`, `Input`, `Label`, `Textarea`
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Badge`, `Switch`
- `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuTrigger`

**lucide-react:**
- `Search`, `Filter`, `Plus`, `Edit`, `Eye`, `Trash2`
- `ArrowLeft`, `ArrowRight`, `Save`, `ImagePlus`
- `Star`, `MoreHorizontal`, `ChevronDown`, `Check`

---

## 次のステップ

1. **Admin API実装**
   - 商品の登録・更新・削除エンドポイント
   - フロントエンドからのmutation実装

2. **画像アップロード**
   - S3連携
   - 商品画像のCRUD

3. **SEO対応**
   - Server Componentでのデータ取得
   - メタデータ生成の復活

4. **商品検索UI**
   - ヘッダー検索機能の実装
   - 検索結果ページ
