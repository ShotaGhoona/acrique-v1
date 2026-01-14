import { useQuery } from '@tanstack/react-query';
import { adminUserApi } from '@/entities/admin-domain/admin-user/api/admin-user-api';
import type { GetAdminUsersRequest } from '@/entities/admin-domain/admin-user/model/types';

export const ADMIN_USERS_QUERY_KEY = ['admin-users'];

export function useAdminUsers(params?: GetAdminUsersRequest) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, params],
    queryFn: () => adminUserApi.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
