import httpClient from '@/shared/api/client/http-client';
import {
  GetAdminUsersRequest,
  GetAdminUsersResponse,
  GetAdminUserResponse,
  GetAdminUserOrdersRequest,
  GetAdminUserOrdersResponse,
} from '../model/types';

/**
 * 管理者顧客管理API
 */
export const adminUserApi = {
  /**
   * 顧客一覧取得
   */
  async getUsers(
    params?: GetAdminUsersRequest,
  ): Promise<GetAdminUsersResponse> {
    const response = await httpClient.get<GetAdminUsersResponse>(
      '/api/admin/users',
      { params },
    );
    return response.data;
  },

  /**
   * 顧客詳細取得
   */
  async getUser(userId: number): Promise<GetAdminUserResponse> {
    const response = await httpClient.get<GetAdminUserResponse>(
      `/api/admin/users/${userId}`,
    );
    return response.data;
  },

  /**
   * 顧客注文履歴取得
   */
  async getUserOrders(
    userId: number,
    params?: GetAdminUserOrdersRequest,
  ): Promise<GetAdminUserOrdersResponse> {
    const response = await httpClient.get<GetAdminUserOrdersResponse>(
      `/api/admin/users/${userId}/orders`,
      { params },
    );
    return response.data;
  },
};
