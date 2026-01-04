import { useQuery } from '@tanstack/react-query';
import { adminUserApi } from '@/entities/admin-user/api/admin-user-api';

export const ADMIN_USER_QUERY_KEY = ['admin-user'];

export function useAdminUser(userId: number) {
  return useQuery({
    queryKey: [...ADMIN_USER_QUERY_KEY, userId],
    queryFn: () => adminUserApi.getUser(userId),
    staleTime: 1000 * 60 * 5, // 5分
    enabled: !!userId,
  });
}
