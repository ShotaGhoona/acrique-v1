import type { AdminRole } from '@/shared/domain/admin/model/types';

// Re-export for convenience
export type { AdminRole };

// === 管理者 ===
export interface Admin {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string | null;
}

// === 管理者一覧取得リクエスト ===
export interface GetAdminsRequest {
  limit?: number;
  offset?: number;
}

// === 管理者一覧取得レスポンス ===
export interface GetAdminsResponse {
  admins: Admin[];
  total: number;
  limit: number;
  offset: number;
}

// === 管理者作成リクエスト ===
export interface CreateAdminRequest {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
}

// === 管理者作成レスポンス ===
export interface CreateAdminResponse {
  admin: Admin;
  message: string;
}

// === 管理者更新リクエスト ===
export interface UpdateAdminRequest {
  email?: string;
  password?: string;
  name?: string;
  role?: AdminRole;
  is_active?: boolean;
}

// === 管理者更新レスポンス ===
export interface UpdateAdminResponse {
  admin: Admin;
  message: string;
}

// === 管理者削除レスポンス ===
export interface DeleteAdminResponse {
  message: string;
}
