import httpClient from '@/shared/api/client/http-client';
import { GetAdminLogsRequest, GetAdminLogsResponse } from '../model/types';

/**
 * 管理者操作ログAPI
 */
export const adminLogApi = {
  /**
   * 操作ログ一覧取得
   */
  async getLogs(params?: GetAdminLogsRequest): Promise<GetAdminLogsResponse> {
    const response = await httpClient.get<GetAdminLogsResponse>(
      '/api/admin/logs',
      { params },
    );
    return response.data;
  },
};
