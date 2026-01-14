import httpClient from '@/shared/api/client/http-client';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  GetMeResponse,
  UpdateMeRequest,
  UpdateMeResponse,
} from '../model/types';

/**
 * ユーザーAPI
 */
export const userApi = {
  /**
   * 自分の情報取得
   */
  async getMe(): Promise<GetMeResponse> {
    const response = await httpClient.get<GetMeResponse>('/api/users/me');
    return response.data;
  },

  /**
   * 自分の情報更新
   */
  async updateMe(data: UpdateMeRequest): Promise<UpdateMeResponse> {
    const response = await httpClient.put<UpdateMeResponse>(
      '/api/users/me',
      data,
    );
    return response.data;
  },

  /**
   * パスワード変更
   */
  async changePassword(
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const response = await httpClient.put<ChangePasswordResponse>(
      '/api/users/me/password',
      data,
    );
    return response.data;
  },
};
