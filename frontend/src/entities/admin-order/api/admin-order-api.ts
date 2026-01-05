import httpClient from '@/shared/api/client/http-client';
import {
  GetAdminOrdersRequest,
  GetAdminOrdersResponse,
  GetAdminOrderResponse,
  UpdateAdminOrderRequest,
  UpdateAdminOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  ShipOrderRequest,
  ShipOrderResponse,
} from '../model/types';

/**
 * 管理者注文管理API
 */
export const adminOrderApi = {
  /**
   * 注文一覧取得
   */
  async getOrders(params?: GetAdminOrdersRequest): Promise<GetAdminOrdersResponse> {
    const response = await httpClient.get<GetAdminOrdersResponse>(
      '/api/admin/orders',
      { params },
    );
    return response.data;
  },

  /**
   * 注文詳細取得
   */
  async getOrder(orderId: number): Promise<GetAdminOrderResponse> {
    const response = await httpClient.get<GetAdminOrderResponse>(
      `/api/admin/orders/${orderId}`,
    );
    return response.data;
  },

  /**
   * 注文更新
   */
  async updateOrder(
    orderId: number,
    data: UpdateAdminOrderRequest,
  ): Promise<UpdateAdminOrderResponse> {
    const response = await httpClient.put<UpdateAdminOrderResponse>(
      `/api/admin/orders/${orderId}`,
      data,
    );
    return response.data;
  },

  /**
   * ステータス更新
   */
  async updateStatus(
    orderId: number,
    data: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse> {
    const response = await httpClient.put<UpdateOrderStatusResponse>(
      `/api/admin/orders/${orderId}/status`,
      data,
    );
    return response.data;
  },

  /**
   * 発送処理
   */
  async shipOrder(
    orderId: number,
    data: ShipOrderRequest,
  ): Promise<ShipOrderResponse> {
    const response = await httpClient.post<ShipOrderResponse>(
      `/api/admin/orders/${orderId}/ship`,
      data,
    );
    return response.data;
  },
};
