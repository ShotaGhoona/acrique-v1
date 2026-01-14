import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin-domain/admin/api/admin-api';
import type { GetAdminsRequest } from '@/entities/admin-domain/admin/model/types';

export const ADMINS_QUERY_KEY = ['admins'];

export function useAdmins(params?: GetAdminsRequest) {
  return useQuery({
    queryKey: [...ADMINS_QUERY_KEY, params],
    queryFn: () => adminApi.getAdmins(params),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
