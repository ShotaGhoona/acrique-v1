import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/entities/order/api/order-api';
import type { GetOrdersRequest } from '@/entities/order/model/types';

export const ORDERS_QUERY_KEY = ['orders'];

export function useOrders(params?: GetOrdersRequest) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params],
    queryFn: () => orderApi.getOrders(params),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
