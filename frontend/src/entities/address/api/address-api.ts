import httpClient from '@/shared/api/client/http-client';
import {
  CreateAddressRequest,
  CreateAddressResponse,
  DeleteAddressResponse,
  GetAddressListResponse,
  GetAddressResponse,
  SetDefaultAddressResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
} from '../model/types';

/**
 * 配送先API
 */
export const addressApi = {
  /**
   * 配送先一覧取得
   */
  async getAddresses(): Promise<GetAddressListResponse> {
    const response =
      await httpClient.get<GetAddressListResponse>('/api/addresses');
    return response.data;
  },

  /**
   * 配送先詳細取得
   */
  async getAddress(id: number): Promise<GetAddressResponse> {
    const response = await httpClient.get<GetAddressResponse>(
      `/api/addresses/${id}`,
    );
    return response.data;
  },

  /**
   * 配送先追加
   */
  async createAddress(
    data: CreateAddressRequest,
  ): Promise<CreateAddressResponse> {
    const response = await httpClient.post<CreateAddressResponse>(
      '/api/addresses',
      data,
    );
    return response.data;
  },

  /**
   * 配送先更新
   */
  async updateAddress(
    id: number,
    data: UpdateAddressRequest,
  ): Promise<UpdateAddressResponse> {
    const response = await httpClient.put<UpdateAddressResponse>(
      `/api/addresses/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * 配送先削除
   */
  async deleteAddress(id: number): Promise<DeleteAddressResponse> {
    const response = await httpClient.delete<DeleteAddressResponse>(
      `/api/addresses/${id}`,
    );
    return response.data;
  },

  /**
   * デフォルト配送先設定
   */
  async setDefaultAddress(id: number): Promise<SetDefaultAddressResponse> {
    const response = await httpClient.put<SetDefaultAddressResponse>(
      `/api/addresses/${id}/default`,
    );
    return response.data;
  },
};
