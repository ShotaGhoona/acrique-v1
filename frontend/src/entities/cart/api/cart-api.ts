import httpClient from '@/shared/api/client/http-client';
import {
  AddToCartRequest,
  AddToCartResponse,
  ClearCartResponse,
  DeleteCartItemResponse,
  GetCartResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
} from '../model/types';

/**
 * カートAPI
 */
export const cartApi = {
  /**
   * カート内容取得
   */
  async getCart(): Promise<GetCartResponse> {
    const response = await httpClient.get<GetCartResponse>('/api/cart');
    return response.data;
  },

  /**
   * カートに追加
   */
  async addToCart(data: AddToCartRequest): Promise<AddToCartResponse> {
    const response = await httpClient.post<AddToCartResponse>(
      '/api/cart/items',
      data,
    );
    return response.data;
  },

  /**
   * カートアイテム更新
   */
  async updateCartItem(
    itemId: number,
    data: UpdateCartItemRequest,
  ): Promise<UpdateCartItemResponse> {
    const response = await httpClient.put<UpdateCartItemResponse>(
      `/api/cart/items/${itemId}`,
      data,
    );
    return response.data;
  },

  /**
   * カートアイテム削除
   */
  async deleteCartItem(itemId: number): Promise<DeleteCartItemResponse> {
    const response = await httpClient.delete<DeleteCartItemResponse>(
      `/api/cart/items/${itemId}`,
    );
    return response.data;
  },

  /**
   * カートを空にする
   */
  async clearCart(): Promise<ClearCartResponse> {
    const response = await httpClient.delete<ClearCartResponse>('/api/cart');
    return response.data;
  },
};
