import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '@/entities/admin-dashboard/api/admin-dashboard-api';

export const ADMIN_DASHBOARD_QUERY_KEY = ['admin-dashboard'];

export function useAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: () => adminDashboardApi.getDashboard(),
    staleTime: 1000 * 60 * 1, // 1分（ダッシュボードは頻繁に更新）
  });
}
