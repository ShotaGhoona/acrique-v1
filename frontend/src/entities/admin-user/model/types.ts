import type { Order } from '@/entities/order/model/types';

// === 管理者用顧客情報 ===
export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  is_verified: boolean;
  order_count: number;
  total_spent: number;
  created_at: string | null;
  updated_at: string | null;
}

// === 顧客一覧取得リクエスト ===
export interface GetAdminUsersRequest {
  search?: string;
  limit?: number;
  offset?: number;
}

// === 顧客一覧取得レスポンス ===
export interface GetAdminUsersResponse {
  users: AdminUser[];
  total: number;
  limit: number;
  offset: number;
}

// === 顧客詳細取得レスポンス ===
export interface GetAdminUserResponse {
  user: AdminUser;
}

// === 顧客注文履歴取得リクエスト ===
export interface GetAdminUserOrdersRequest {
  limit?: number;
  offset?: number;
}

// === 顧客注文履歴取得レスポンス ===
export interface GetAdminUserOrdersResponse {
  orders: Order[];
  total: number;
  limit: number;
  offset: number;
}
