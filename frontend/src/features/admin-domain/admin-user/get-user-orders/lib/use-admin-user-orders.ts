import { useQuery } from '@tanstack/react-query';
import { adminUserApi } from '@/entities/admin-domain/admin-user/api/admin-user-api';
import type { GetAdminUserOrdersRequest } from '@/entities/admin-domain/admin-user/model/types';

export const ADMIN_USER_ORDERS_QUERY_KEY = ['admin-user-orders'];

export function useAdminUserOrders(
  userId: number,
  params?: GetAdminUserOrdersRequest,
) {
  return useQuery({
    queryKey: [...ADMIN_USER_ORDERS_QUERY_KEY, userId, params],
    queryFn: () => adminUserApi.getUserOrders(userId, params),
    staleTime: 1000 * 60 * 5, // 5分
    enabled: !!userId,
  });
}
