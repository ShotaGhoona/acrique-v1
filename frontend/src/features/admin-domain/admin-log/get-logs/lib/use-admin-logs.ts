import { useQuery } from '@tanstack/react-query';
import { adminLogApi } from '@/entities/admin-domain/admin-log/api/admin-log-api';
import type { GetAdminLogsRequest } from '@/entities/admin-domain/admin-log/model/types';

export const ADMIN_LOGS_QUERY_KEY = ['admin-logs'];

export function useAdminLogs(params?: GetAdminLogsRequest) {
  return useQuery({
    queryKey: [...ADMIN_LOGS_QUERY_KEY, params],
    queryFn: () => adminLogApi.getLogs(params),
    staleTime: 1000 * 60 * 1, // 1分
  });
}
