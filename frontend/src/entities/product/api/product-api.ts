import httpClient from '@/shared/api/client/http-client';
import type {
  ProductDetail,
  ProductListParams,
  ProductListResponse,
  ProductOptionsResponse,
  ProductRelatedResponse,
  ProductSearchParams,
  ProductSearchResponse,
} from '../model/types';

/**
 * 商品API
 */
export const productApi = {
  /**
   * 商品一覧を取得
   */
  async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    const response = await httpClient.get<ProductListResponse>(
      '/api/products',
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * 商品詳細を取得
   */
  async getProduct(productId: string): Promise<ProductDetail> {
    const response = await httpClient.get<ProductDetail>(
      `/api/products/${productId}`,
    );
    return response.data;
  },

  /**
   * おすすめ商品を取得
   */
  async getFeaturedProducts(limit?: number): Promise<ProductListResponse> {
    const response = await httpClient.get<ProductListResponse>(
      '/api/products/featured',
      {
        params: { limit },
      },
    );
    return response.data;
  },

  /**
   * 商品を検索
   */
  async searchProducts(
    params: ProductSearchParams,
  ): Promise<ProductSearchResponse> {
    const response = await httpClient.get<ProductSearchResponse>(
      '/api/products/search',
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * 商品オプションを取得
   */
  async getProductOptions(productId: string): Promise<ProductOptionsResponse> {
    const response = await httpClient.get<ProductOptionsResponse>(
      `/api/products/${productId}/options`,
    );
    return response.data;
  },

  /**
   * 関連商品を取得
   */
  async getRelatedProducts(productId: string): Promise<ProductRelatedResponse> {
    const response = await httpClient.get<ProductRelatedResponse>(
      `/api/products/${productId}/related`,
    );
    return response.data;
  },
};
