import { useQuery } from '@tanstack/react-query';
import { adminOrderApi } from '@/entities/admin-domain/admin-order/api/admin-order-api';

export const ADMIN_ORDER_QUERY_KEY = ['admin-order'];

export function useAdminOrder(orderId: number) {
  return useQuery({
    queryKey: [...ADMIN_ORDER_QUERY_KEY, orderId],
    queryFn: () => adminOrderApi.getOrder(orderId),
    staleTime: 1000 * 60 * 1, // 1分
    enabled: !!orderId,
  });
}
