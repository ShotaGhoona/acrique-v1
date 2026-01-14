import { useQuery } from '@tanstack/react-query';
import { adminAuthApi } from '@/entities/admin-domain/admin-auth/api/admin-auth-api';

export const ADMIN_AUTH_STATUS_QUERY_KEY = ['admin-auth-status'];

export function useAdminAuthStatus() {
  return useQuery({
    queryKey: ADMIN_AUTH_STATUS_QUERY_KEY,
    queryFn: () => adminAuthApi.getStatus(),
    staleTime: 1000 * 60 * 5, // 5分
    retry: false,
  });
}
