# Orders Frontend 実装レポート

## 概要

注文管理のフロントエンドEntity層とFeature層を実装。Feature-Sliced Design（FSD）に従い、API連携用のhooksを構築した。

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

### entities/order

**ファイル構成:**

| ファイル | 説明 |
|----------|------|
| `entities/order/model/types.ts` | 型定義 |
| `entities/order/api/order-api.ts` | API呼び出し関数 |
| `entities/order/index.ts` | 公開エクスポート |

**API関数:**

```typescript
getOrders(params?: GetOrdersRequest): Promise<GetOrdersResponse>
getOrder(orderId: number): Promise<GetOrderResponse>
createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse>
cancelOrder(orderId: number, data: CancelOrderRequest): Promise<CancelOrderResponse>
```

**型定義:**

```typescript
type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'paid'
  | 'awaiting_data'
  | 'data_reviewing'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

type PaymentMethod = 'stripe' | 'bank_transfer';

interface OrderItem {
  id: number;
  product_id: string;
  product_name: string;
  product_name_ja: string | null;
  quantity: number;
  unit_price: number;
  options: Record<string, unknown> | null;
  subtotal: number;
}

interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod | null;
  paid_at: string | null;
  shipped_at: string | null;
  tracking_number: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  notes: string | null;
  created_at: string | null;
}

interface OrderDetail extends Order {
  shipping_address_id: number | null;
  cancel_reason: string | null;
  items: OrderItem[];
}

interface CreateOrderRequest {
  shipping_address_id: number;
  payment_method: PaymentMethod;
  notes?: string;
  items?: CreateOrderItemRequest[];
}

interface CancelOrderRequest {
  cancel_reason?: string;
}
```

---

### features/order

| ディレクトリ | 説明 |
|--------------|------|
| `features/order/get-orders/` | 注文一覧取得フック |
| `features/order/get-order/` | 注文詳細取得フック |
| `features/order/create-order/` | 注文作成フック |
| `features/order/cancel-order/` | 注文キャンセルフック |

**フック一覧:**

| フック | 用途 | React Query |
|--------|------|-------------|
| `useOrders(params?)` | 注文一覧取得 | useQuery |
| `useOrder(orderId)` | 注文詳細取得 | useQuery |
| `useCreateOrder()` | 注文作成 | useMutation |
| `useCancelOrder()` | 注文キャンセル | useMutation |

**キャッシュキー:**

```typescript
export const ORDERS_QUERY_KEY = ['orders'];
export const ORDER_QUERY_KEY = ['order'];
```

---

## 作成ファイル一覧

### entities

```
src/entities/order/
├── model/
│   └── types.ts
├── api/
│   └── order-api.ts
└── index.ts
```

### features

```
src/features/order/
├── get-orders/
│   ├── lib/
│   │   └── use-orders.ts
│   └── index.ts
├── get-order/
│   ├── lib/
│   │   └── use-order.ts
│   └── index.ts
├── create-order/
│   ├── lib/
│   │   └── use-create-order.ts
│   └── index.ts
└── cancel-order/
    ├── lib/
    │   └── use-cancel-order.ts
    └── index.ts
```

---

## バックエンド連携

| フロントエンド | バックエンドAPI |
|----------------|-----------------|
| `useOrders()` | `GET /api/orders` |
| `useOrder(orderId)` | `GET /api/orders/{id}` |
| `useCreateOrder()` | `POST /api/orders` |
| `useCancelOrder()` | `POST /api/orders/{id}/cancel` |

---

## React Query設定

| 設定 | 値 |
|------|-----|
| `staleTime` | 5分 (`1000 * 60 * 5`) |
| Mutation成功時 | 注文一覧・詳細キャッシュを自動invalidate |

### キャッシュ無効化

- **注文作成時**: `ORDERS_QUERY_KEY`, `CART_QUERY_KEY` を無効化
- **注文キャンセル時**: `ORDERS_QUERY_KEY`, `ORDER_QUERY_KEY` を無効化

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
| 注文履歴 | `/mypage/orders` | `useOrders` で注文一覧表示 |
| 注文詳細 | `/mypage/orders/[id]` | `useOrder` で注文詳細表示、`useCancelOrder` でキャンセル |
| チェックアウト | `/checkout` | `useCreateOrder` で注文作成 |
| 注文完了 | `/checkout/complete` | 作成された注文情報を表示 |

### 実装が必要なUI

1. **注文一覧ページ**
   - 注文カード表示
   - ステータスフィルタ
   - ページネーション

2. **注文詳細ページ**
   - 注文情報表示
   - 注文明細一覧
   - キャンセルボタン
   - 追跡番号表示

3. **チェックアウトフロー**
   - 配送先選択
   - 決済方法選択
   - 注文確認
   - 注文作成

### Widgetsの作成

- `widgets/order/ui/OrderList.tsx`
- `widgets/order/ui/OrderCard.tsx`
- `widgets/order/ui/OrderDetail.tsx`
- `widgets/order/ui/OrderItems.tsx`
- `widgets/checkout/ui/CheckoutForm.tsx`

---

## 備考

- 認証必須のAPI（ログインしていないと注文操作不可）
- 注文作成時にカートを空にする連携済み
- キャンセルは pending/awaiting_payment/paid ステータスのみ可能
- 注文番号は `ACQ-YYMMDD-XXX` 形式
- 消費税は10%で計算される
