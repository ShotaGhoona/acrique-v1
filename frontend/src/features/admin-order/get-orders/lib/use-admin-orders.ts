import { useQuery } from '@tanstack/react-query';
import { adminOrderApi } from '@/entities/admin-order/api/admin-order-api';
import type { GetAdminOrdersRequest } from '@/entities/admin-order/model/types';

export const ADMIN_ORDERS_QUERY_KEY = ['admin-orders'];

export function useAdminOrders(params?: GetAdminOrdersRequest) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, params],
    queryFn: () => adminOrderApi.getOrders(params),
    staleTime: 1000 * 60 * 1, // 1分
  });
}
