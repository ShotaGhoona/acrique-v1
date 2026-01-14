import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/entities/checkout-domain/order/api/order-api';

export const ORDER_QUERY_KEY = ['order'];

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEY, orderId],
    queryFn: () => orderApi.getOrder(orderId),
    staleTime: 1000 * 60 * 5, // 5分
    enabled: orderId > 0,
  });
}
