import httpClient from '@/shared/api/client/http-client';
import type {
  GetAdminProductMastersRequest,
  GetAdminProductMastersResponse,
  CreateProductMasterRequest,
  CreateProductMasterResponse,
  UpdateProductMasterRequest,
  UpdateProductMasterResponse,
} from '../model/types';

/**
 * 管理者商品マスタAPI
 */
export const adminProductMasterApi = {
  /**
   * 商品マスタ一覧取得
   */
  async getProductMasters(
    params?: GetAdminProductMastersRequest,
  ): Promise<GetAdminProductMastersResponse> {
    const response = await httpClient.get<GetAdminProductMastersResponse>(
      '/api/admin/masters',
      { params },
    );
    return response.data;
  },

  /**
   * 商品マスタ作成
   */
  async createProductMaster(
    data: CreateProductMasterRequest,
  ): Promise<CreateProductMasterResponse> {
    const response = await httpClient.post<CreateProductMasterResponse>(
      '/api/admin/masters',
      data,
    );
    return response.data;
  },

  /**
   * 商品マスタ更新
   */
  async updateProductMaster(
    masterId: string,
    data: UpdateProductMasterRequest,
  ): Promise<UpdateProductMasterResponse> {
    const response = await httpClient.put<UpdateProductMasterResponse>(
      `/api/admin/masters/${masterId}`,
      data,
    );
    return response.data;
  },
};
