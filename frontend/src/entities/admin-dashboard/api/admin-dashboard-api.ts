import httpClient from '@/shared/api/client/http-client';
import {
  GetDashboardResponse,
  GetStatsRequest,
  GetStatsResponse,
} from '../model/types';

/**
 * 管理者ダッシュボードAPI
 */
export const adminDashboardApi = {
  /**
   * ダッシュボード情報取得
   */
  async getDashboard(): Promise<GetDashboardResponse> {
    const response = await httpClient.get<GetDashboardResponse>(
      '/api/admin/dashboard',
    );
    return response.data;
  },

  /**
   * 売上統計取得
   */
  async getStats(params: GetStatsRequest): Promise<GetStatsResponse> {
    const response = await httpClient.get<GetStatsResponse>(
      '/api/admin/dashboard/stats',
      { params },
    );
    return response.data;
  },
};
