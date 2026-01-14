import type {
  OrderStatus,
  PaymentMethod,
} from '@/shared/domain/order/model/types';

// === 顧客の注文（管理者用） ===
export interface AdminUserOrder {
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

// === 管理者用顧客情報 ===
export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  name_kana: string | null;
  phone: string | null;
  company: string | null;
  is_email_verified: boolean;
  created_at: string | null;
  updated_at: string | null;
}

// === 管理者用顧客詳細情報 ===
export interface AdminUserDetail extends AdminUser {
  stripe_customer_id: string | null;
  order_count: number;
  total_spent: number;
}

// === 顧客一覧取得リクエスト ===
export interface GetAdminUsersRequest {
  search?: string;
  limit?: number;
  offset?: number;
}

// === 顧客一覧取得レスポンス ===
export interface GetAdminUsersResponse {
  customers: AdminUser[];
  total: number;
  limit: number;
  offset: number;
}

// === 顧客詳細取得レスポンス ===
export interface GetAdminUserResponse {
  customer: AdminUserDetail;
}

// === 顧客注文履歴取得リクエスト ===
export interface GetAdminUserOrdersRequest {
  limit?: number;
  offset?: number;
}

// === 顧客注文履歴取得レスポンス ===
export interface GetAdminUserOrdersResponse {
  orders: AdminUserOrder[];
  total: number;
  limit: number;
  offset: number;
}
