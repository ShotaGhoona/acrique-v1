import httpClient from '@/shared/api/client/http-client';
import {
  AdminAuthStatusResponse,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminLogoutResponse,
} from '../model/types';

/**
 * 管理者認証API
 */
export const adminAuthApi = {
  /**
   * 管理者ログイン
   */
  async login(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await httpClient.post<AdminLoginResponse>(
      '/api/admin/auth/login',
      data,
    );
    return response.data;
  },

  /**
   * 管理者ログアウト
   */
  async logout(): Promise<AdminLogoutResponse> {
    const response = await httpClient.post<AdminLogoutResponse>(
      '/api/admin/auth/logout',
    );
    return response.data;
  },

  /**
   * 認証状態確認
   */
  async getStatus(): Promise<AdminAuthStatusResponse> {
    const response = await httpClient.get<AdminAuthStatusResponse>(
      '/api/admin/auth/status',
    );
    return response.data;
  },
};
