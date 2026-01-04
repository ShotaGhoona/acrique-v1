import { useQuery } from '@tanstack/react-query';
import { orderApi, GetOrdersRequest } from '@/entities/order';

export const ORDERS_QUERY_KEY = ['orders'];

export function useOrders(params?: GetOrdersRequest) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params],
    queryFn: () => orderApi.getOrders(params),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
