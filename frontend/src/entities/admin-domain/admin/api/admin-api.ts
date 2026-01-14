import httpClient from '@/shared/api/client/http-client';
import {
  GetAdminsRequest,
  GetAdminsResponse,
  CreateAdminRequest,
  CreateAdminResponse,
  UpdateAdminRequest,
  UpdateAdminResponse,
  DeleteAdminResponse,
} from '../model/types';

/**
 * 管理者管理API
 */
export const adminApi = {
  /**
   * 管理者一覧取得
   */
  async getAdmins(params?: GetAdminsRequest): Promise<GetAdminsResponse> {
    const response = await httpClient.get<GetAdminsResponse>(
      '/api/admin/admins',
      { params },
    );
    return response.data;
  },

  /**
   * 管理者作成
   */
  async createAdmin(data: CreateAdminRequest): Promise<CreateAdminResponse> {
    const response = await httpClient.post<CreateAdminResponse>(
      '/api/admin/admins',
      data,
    );
    return response.data;
  },

  /**
   * 管理者更新
   */
  async updateAdmin(
    adminId: number,
    data: UpdateAdminRequest,
  ): Promise<UpdateAdminResponse> {
    const response = await httpClient.put<UpdateAdminResponse>(
      `/api/admin/admins/${adminId}`,
      data,
    );
    return response.data;
  },

  /**
   * 管理者削除
   */
  async deleteAdmin(adminId: number): Promise<DeleteAdminResponse> {
    const response = await httpClient.delete<DeleteAdminResponse>(
      `/api/admin/admins/${adminId}`,
    );
    return response.data;
  },
};
