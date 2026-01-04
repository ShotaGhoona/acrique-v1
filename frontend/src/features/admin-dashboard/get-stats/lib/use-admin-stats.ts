import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '@/entities/admin-dashboard/api/admin-dashboard-api';
import type { GetStatsRequest } from '@/entities/admin-dashboard/model/types';

export const ADMIN_STATS_QUERY_KEY = ['admin-stats'];

export function useAdminStats(params: GetStatsRequest) {
  return useQuery({
    queryKey: [...ADMIN_STATS_QUERY_KEY, params],
    queryFn: () => adminDashboardApi.getStats(params),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
