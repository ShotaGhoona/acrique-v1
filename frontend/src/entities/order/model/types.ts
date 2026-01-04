// === 注文ステータス・決済方法 ===
import type {
  OrderStatus,
  PaymentMethod,
} from '@/shared/domain/order/model/types';

export type { OrderStatus, PaymentMethod };

// === 注文明細型 ===
export interface OrderItem {
  id: number;
  product_id: string;
  product_name: string;
  product_name_ja: string | null;
  quantity: number;
  unit_price: number;
  options: Record<string, unknown> | null;
  subtotal: number;
}

// === 注文型 ===
export interface Order {
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

// === 注文詳細型（明細付き） ===
export interface OrderDetail extends Order {
  shipping_address_id: number | null;
  cancel_reason: string | null;
  items: OrderItem[];
}

// === 注文一覧取得 ===
export interface GetOrdersRequest {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}

export interface GetOrdersResponse {
  orders: Order[];
  total: number;
  limit: number;
  offset: number;
}

// === 注文詳細取得 ===
export interface GetOrderResponse {
  order: OrderDetail;
}

// === 注文作成 ===
export interface CreateOrderItemRequest {
  product_id: string;
  quantity: number;
  options?: Record<string, unknown>;
}

export interface CreateOrderRequest {
  shipping_address_id: number;
  payment_method: PaymentMethod;
  notes?: string;
  items?: CreateOrderItemRequest[];
}

export interface CreateOrderResponse {
  order: OrderDetail;
  message: string;
}

// === 注文キャンセル ===
export interface CancelOrderRequest {
  cancel_reason?: string;
}

export interface CancelOrderResponse {
  order: Order;
  message: string;
}
