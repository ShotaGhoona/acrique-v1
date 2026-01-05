import type {
  OrderStatus,
  PaymentMethod,
} from '@/shared/domain/order/model/types';

// Re-export for convenience
export type { OrderStatus, PaymentMethod };

// === 管理者用注文明細 ===
export interface AdminOrderItem {
  id: number;
  product_id: string;
  product_name: string;
  product_name_ja: string | null;
  quantity: number;
  unit_price: number;
  options: Record<string, unknown> | null;
  subtotal: number;
}

// === 管理者用注文（一覧用） ===
export interface AdminOrder {
  id: number;
  user_id: number;
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
  created_at: string;
}

// === 管理者用注文詳細 ===
export interface AdminOrderDetail extends AdminOrder {
  shipping_address_id: number | null;
  stripe_payment_intent_id: string | null;
  confirmed_at: string | null;
  cancel_reason: string | null;
  admin_notes: string | null;
  updated_at: string | null;
  items: AdminOrderItem[];
}

// === 注文一覧取得リクエスト ===
export interface GetAdminOrdersRequest {
  search?: string;
  status?: OrderStatus[];
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

// === 注文一覧取得レスポンス ===
export interface GetAdminOrdersResponse {
  orders: AdminOrder[];
  total: number;
  limit: number;
  offset: number;
}

// === 注文詳細取得レスポンス ===
export interface GetAdminOrderResponse {
  order: AdminOrderDetail;
}

// === 注文更新リクエスト ===
export interface UpdateAdminOrderRequest {
  admin_notes?: string;
  shipping_address_id?: number;
}

// === 注文更新レスポンス ===
export interface UpdateAdminOrderResponse {
  order: AdminOrderDetail;
  message: string;
}

// === ステータス更新リクエスト ===
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

// === ステータス更新レスポンス ===
export interface UpdateOrderStatusResponse {
  order: AdminOrderDetail;
  message: string;
}

// === 発送処理リクエスト ===
export interface ShipOrderRequest {
  tracking_number: string;
  carrier?: string;
}

// === 発送処理レスポンス ===
export interface ShipOrderResponse {
  order: AdminOrderDetail;
  message: string;
}
