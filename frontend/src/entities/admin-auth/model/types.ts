// === 管理者ロール ===
import type { AdminRole } from '@/shared/domain/admin/model/types';

export type { AdminRole };

// === 管理者情報 ===
export interface AdminInfo {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
}

// === ログインリクエスト ===
export interface AdminLoginRequest {
  email: string;
  password: string;
}

// === ログインレスポンス ===
export interface AdminLoginResponse {
  admin: AdminInfo;
  message: string;
}

// === ログアウトレスポンス ===
export interface AdminLogoutResponse {
  message: string;
}

// === 認証状態レスポンス ===
export interface AdminAuthStatusResponse {
  authenticated: boolean;
  admin: AdminInfo | null;
}
