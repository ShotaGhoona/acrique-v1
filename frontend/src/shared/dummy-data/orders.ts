/**
 * 注文 ダミーデータ
 * @see docs/requirements/12-データベース設計.md
 */

import { getProductById, type Product } from './products';
import { getAddressById, type Address } from './users';

// =============================================================================
// 型定義（DB設計に基づく）
// =============================================================================

export type OrderStatus =
  | 'pending' // 注文受付
  | 'awaiting_payment' // 支払い待ち
  | 'paid' // 支払い済み
  | 'awaiting_data' // 入稿待ち
  | 'data_reviewing' // 入稿確認中
  | 'confirmed' // 確認済み
  | 'processing' // 製作中
  | 'shipped' // 発送済み
  | 'delivered' // 配達完了
  | 'cancelled'; // キャンセル

export interface Order {
  id: number;
  user_id: number;
  order_number: string; // ACQ-240101-001
  status: OrderStatus;
  shipping_address_id: number;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_method: 'stripe' | 'bank_transfer';
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  confirmed_at: string | null;
  shipped_at: string | null;
  tracking_number: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  notes: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  product_name_ja: string;
  quantity: number;
  unit_price: number;
  options: Record<string, string>;
  subtotal: number;
}

// 注文詳細ページ用の複合型
export interface OrderDetail extends Order {
  items: (OrderItem & { product?: Product })[];
  shipping_address: Address | undefined;
}

// =============================================================================
// ステータスラベル
// =============================================================================

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: '注文受付',
  awaiting_payment: '支払い待ち',
  paid: '支払い済み',
  awaiting_data: '入稿待ち',
  data_reviewing: '入稿確認中',
  confirmed: '確認済み',
  processing: '製作中',
  shipped: '発送済み',
  delivered: '配達完了',
  cancelled: 'キャンセル',
};

export const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'bg-gray-100 text-gray-800',
  awaiting_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  awaiting_data: 'bg-orange-100 text-orange-800',
  data_reviewing: 'bg-purple-100 text-purple-800',
  confirmed: 'bg-cyan-100 text-cyan-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-teal-100 text-teal-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// =============================================================================
// ダミーデータ - 注文
// =============================================================================

export const orders: Order[] = [
  {
    id: 1,
    user_id: 1,
    order_number: 'ACQ-240601-001',
    status: 'processing',
    shipping_address_id: 1,
    subtotal: 25800,
    shipping_fee: 0,
    tax: 2580,
    total: 28380,
    payment_method: 'stripe',
    stripe_payment_intent_id: 'pi_xxx123',
    paid_at: '2024-06-01T12:00:00Z',
    confirmed_at: '2024-06-03T10:00:00Z',
    shipped_at: null,
    tracking_number: null,
    delivered_at: null,
    cancelled_at: null,
    cancel_reason: null,
    notes: '急ぎでお願いします',
    admin_notes: '',
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-03T10:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    order_number: 'ACQ-240515-002',
    status: 'delivered',
    shipping_address_id: 1,
    subtotal: 12000,
    shipping_fee: 1000,
    tax: 1300,
    total: 14300,
    payment_method: 'stripe',
    stripe_payment_intent_id: 'pi_xxx456',
    paid_at: '2024-05-15T10:00:00Z',
    confirmed_at: '2024-05-16T10:00:00Z',
    shipped_at: '2024-05-20T10:00:00Z',
    tracking_number: '1234-5678-9012',
    delivered_at: '2024-05-22T14:00:00Z',
    cancelled_at: null,
    cancel_reason: null,
    notes: '',
    admin_notes: '',
    created_at: '2024-05-15T09:00:00Z',
    updated_at: '2024-05-22T14:00:00Z',
  },
  {
    id: 3,
    user_id: 1,
    order_number: 'ACQ-240610-003',
    status: 'awaiting_data',
    shipping_address_id: 2,
    subtotal: 8500,
    shipping_fee: 1000,
    tax: 950,
    total: 10450,
    payment_method: 'stripe',
    stripe_payment_intent_id: 'pi_xxx789',
    paid_at: '2024-06-10T10:00:00Z',
    confirmed_at: null,
    shipped_at: null,
    tracking_number: null,
    delivered_at: null,
    cancelled_at: null,
    cancel_reason: null,
    notes: '',
    admin_notes: '',
    created_at: '2024-06-10T09:00:00Z',
    updated_at: '2024-06-10T10:00:00Z',
  },
  {
    id: 4,
    user_id: 2,
    order_number: 'ACQ-240520-004',
    status: 'shipped',
    shipping_address_id: 3,
    subtotal: 45000,
    shipping_fee: 0,
    tax: 4500,
    total: 49500,
    payment_method: 'bank_transfer',
    stripe_payment_intent_id: null,
    paid_at: '2024-05-22T10:00:00Z',
    confirmed_at: '2024-05-25T10:00:00Z',
    shipped_at: '2024-06-01T10:00:00Z',
    tracking_number: '9876-5432-1098',
    delivered_at: null,
    cancelled_at: null,
    cancel_reason: null,
    notes: '請求書払い希望',
    admin_notes: '月末締め翌月払い',
    created_at: '2024-05-20T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
  },
];

// =============================================================================
// ダミーデータ - 注文明細
// =============================================================================

export const orderItems: OrderItem[] = [
  // Order 1
  {
    id: 1,
    order_id: 1,
    product_id: 'qr-cube',
    product_name: 'QR Cube',
    product_name_ja: 'QRキューブ',
    quantity: 5,
    unit_price: 4300,
    options: { サイズ: '70mm角', 厚み: '10mm' },
    subtotal: 21500,
  },
  {
    id: 2,
    order_id: 1,
    product_id: 'sign-holder',
    product_name: 'Sign Holder',
    product_name_ja: 'サインホルダー',
    quantity: 2,
    unit_price: 2150,
    options: {},
    subtotal: 4300,
  },

  // Order 2
  {
    id: 3,
    order_id: 2,
    product_id: 'acrylic-stand',
    product_name: 'Acrylic Stand',
    product_name_ja: 'アクリルスタンド',
    quantity: 4,
    unit_price: 3000,
    options: { サイズ: 'L (15cm)' },
    subtotal: 12000,
  },

  // Order 3
  {
    id: 4,
    order_id: 3,
    product_id: 'award',
    product_name: 'Award Trophy',
    product_name_ja: 'アワードトロフィー',
    quantity: 1,
    unit_price: 8500,
    options: { サイズ: 'M (高さ20cm)', 刻印: 'あり' },
    subtotal: 8500,
  },

  // Order 4
  {
    id: 5,
    order_id: 4,
    product_id: 'wall-sign',
    product_name: 'Floating Wall Sign',
    product_name_ja: 'フローティングウォールサイン',
    quantity: 1,
    unit_price: 40000,
    options: { サイズ: 'A2 (420×594mm)', 素材: '透明アクリル' },
    subtotal: 42000,
  },
  {
    id: 6,
    order_id: 4,
    product_id: 'name-plate',
    product_name: 'Desk Name Plate',
    product_name_ja: '役員用ネームプレート',
    quantity: 3,
    unit_price: 1000,
    options: {},
    subtotal: 3000,
  },
];

// =============================================================================
// ヘルパー関数
// =============================================================================

export const getOrderById = (id: number): Order | undefined => {
  return orders.find((o) => o.id === id);
};

export const getOrderByNumber = (orderNumber: string): Order | undefined => {
  return orders.find((o) => o.order_number === orderNumber);
};

export const getOrdersByUserId = (userId: number): Order[] => {
  return orders.filter((o) => o.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const getOrderItems = (orderId: number): OrderItem[] => {
  return orderItems.filter((item) => item.order_id === orderId);
};

export const getOrderDetail = (orderId: number): OrderDetail | undefined => {
  const order = getOrderById(orderId);
  if (!order) return undefined;

  const items = getOrderItems(orderId).map((item) => ({
    ...item,
    product: getProductById(item.product_id),
  }));

  return {
    ...order,
    items,
    shipping_address: getAddressById(order.shipping_address_id),
  };
};

// 現在のユーザーの注文（デモ用 - user_id: 1）
export const currentUserOrders: Order[] = getOrdersByUserId(1);
