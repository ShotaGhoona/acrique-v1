# Cart Frontend 実装レポート

## 概要

カート管理のフロントエンドEntity層とFeature層を実装。Feature-Sliced Design（FSD）に従い、API連携用のhooksを構築した。

**重要**: 本タスクではEntity層とFeature層のみを実装。Page-Components層（UIコンポーネント）との接続は別タスクで行う。

---

## 実装範囲

| 層 | 実装状況 |
|----|----------|
| entities | 完了 |
| features | 完了 |
| widgets | 未着手 |
| page-components | 未着手 |
| app routes | 未着手 |

---

## アーキテクチャ

### entities/cart

**ファイル構成:**

| ファイル | 説明 |
|----------|------|
| `entities/cart/model/types.ts` | 型定義 |
| `entities/cart/api/cart-api.ts` | API呼び出し関数 |
| `entities/cart/index.ts` | 公開エクスポート |

**API関数:**

```typescript
getCart(): Promise<GetCartResponse>
addToCart(data: AddToCartRequest): Promise<AddToCartResponse>
updateCartItem(itemId: number, data: UpdateCartItemRequest): Promise<UpdateCartItemResponse>
deleteCartItem(itemId: number): Promise<DeleteCartItemResponse>
clearCart(): Promise<ClearCartResponse>
```

**型定義:**

```typescript
interface CartItem {
  id: number;
  product_id: string;
  product_name: string | null;
  product_name_ja: string | null;
  product_image_url: string | null;
  base_price: number;
  quantity: number;
  options: Record<string, unknown> | null;
  subtotal: number;
  created_at: string | null;
  updated_at: string | null;
}

interface GetCartResponse {
  items: CartItem[];
  item_count: number;
  total_quantity: number;
  subtotal: number;
  tax: number;
  total: number;
}

interface AddToCartRequest {
  product_id: string;
  quantity?: number;
  options?: Record<string, unknown>;
}

interface UpdateCartItemRequest {
  quantity?: number;
  options?: Record<string, unknown>;
}
```

---

### features/cart

| ディレクトリ | 説明 |
|--------------|------|
| `features/cart/get-cart/` | カート取得フック |
| `features/cart/add-to-cart/` | カート追加フック |
| `features/cart/update-cart-item/` | カートアイテム更新フック |
| `features/cart/delete-cart-item/` | カートアイテム削除フック |
| `features/cart/clear-cart/` | カート全削除フック |

**フック一覧:**

| フック | 用途 | React Query |
|--------|------|-------------|
| `useCart()` | カート内容取得 | useQuery |
| `useAddToCart()` | カートに追加 | useMutation |
| `useUpdateCartItem()` | カートアイテム更新 | useMutation |
| `useDeleteCartItem()` | カートアイテム削除 | useMutation |
| `useClearCart()` | カート全削除 | useMutation |

**キャッシュキー:**

```typescript
export const CART_QUERY_KEY = ['cart'];
```

---

## 作成ファイル一覧

### entities

```
src/entities/cart/
├── model/
│   └── types.ts
├── api/
│   └── cart-api.ts
└── index.ts
```

### features

```
src/features/cart/
├── get-cart/
│   ├── lib/
│   │   └── use-cart.ts
│   └── index.ts
├── add-to-cart/
│   ├── lib/
│   │   └── use-add-to-cart.ts
│   └── index.ts
├── update-cart-item/
│   ├── lib/
│   │   └── use-update-cart-item.ts
│   └── index.ts
├── delete-cart-item/
│   ├── lib/
│   │   └── use-delete-cart-item.ts
│   └── index.ts
└── clear-cart/
    ├── lib/
    │   └── use-clear-cart.ts
    └── index.ts
```

---

## バックエンド連携

| フロントエンド | バックエンドAPI |
|----------------|-----------------|
| `useCart()` | `GET /api/cart` |
| `useAddToCart()` | `POST /api/cart/items` |
| `useUpdateCartItem()` | `PUT /api/cart/items/{id}` |
| `useDeleteCartItem()` | `DELETE /api/cart/items/{id}` |
| `useClearCart()` | `DELETE /api/cart` |

---

## React Query設定

| 設定 | 値 |
|------|-----|
| `staleTime` | 5分 (`1000 * 60 * 5`) |
| Mutation成功時 | カートキャッシュを自動invalidate |

---

## TypeScript検証

```bash
npx tsc --noEmit
# エラーなし
```

---

## 未実装（次のステップ）

本タスクはEntity層・Feature層のみの実装。以下は別タスクで実施する。

### Page-Componentsとの接続

| ページ | パス | 説明 |
|--------|------|------|
| カート | `/cart` | `useCart`, CRUD hooks を使用 |
| 商品詳細 | `/[category]/[id]` | `useAddToCart` でカート追加ボタン実装 |
| チェックアウト | `/checkout` | `useCart` でカート内容表示 |

### 実装が必要なUI

1. **カートページ**
   - カートアイテム一覧表示
   - 数量変更フォーム
   - 削除ボタン
   - 小計・税・合計表示
   - カートを空にするボタン

2. **商品詳細ページ**
   - カートに追加ボタン
   - 数量選択
   - オプション選択

3. **ヘッダー**
   - カートアイコンにアイテム数バッジ表示

### Widgetsの作成

- `widgets/cart/ui/CartList.tsx`
- `widgets/cart/ui/CartItem.tsx`
- `widgets/cart/ui/CartSummary.tsx`
- `widgets/product/ui/AddToCartButton.tsx`

---

## 備考

- 認証必須のAPI（ログインしていないとカート操作不可）
- 同一商品をカートに追加すると数量が加算される
- オプションはJSON形式で柔軟に対応
- 消費税は10%で計算される
