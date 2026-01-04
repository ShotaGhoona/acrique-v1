import { httpClient } from '@/shared/api';
import {
  CancelOrderRequest,
  CancelOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
} from '../model/types';

/**
 * 注文API
 */
export const orderApi = {
  /**
   * 注文一覧取得
   */
  async getOrders(params?: GetOrdersRequest): Promise<GetOrdersResponse> {
    const response = await httpClient.get<GetOrdersResponse>('/api/orders', {
      params,
    });
    return response.data;
  },

  /**
   * 注文詳細取得
   */
  async getOrder(orderId: number): Promise<GetOrderResponse> {
    const response = await httpClient.get<GetOrderResponse>(
      `/api/orders/${orderId}`,
    );
    return response.data;
  },

  /**
   * 注文作成
   */
  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await httpClient.post<CreateOrderResponse>(
      '/api/orders',
      data,
    );
    return response.data;
  },

  /**
   * 注文キャンセル
   */
  async cancelOrder(
    orderId: number,
    data: CancelOrderRequest,
  ): Promise<CancelOrderResponse> {
    const response = await httpClient.post<CancelOrderResponse>(
      `/api/orders/${orderId}/cancel`,
      data,
    );
    return response.data;
  },
};
