import httpClient from '@/shared/api/client/http-client';
import type { ProductMasterListResponse } from '../model/types';

/**
 * 商品マスタAPI（公開）
 */
export const productMasterApi = {
  /**
   * 商品マスタ一覧を取得（有効なもののみ）
   */
  async getProductMasters(): Promise<ProductMasterListResponse> {
    const response =
      await httpClient.get<ProductMasterListResponse>('/api/masters');
    return response.data;
  },
};
