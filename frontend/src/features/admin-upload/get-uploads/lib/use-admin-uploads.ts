import { useQuery } from '@tanstack/react-query';
import { adminUploadApi } from '@/entities/admin-upload/api/admin-upload-api';
import type { GetAdminUploadsParams } from '@/entities/admin-upload/model/types';
import { ADMIN_UPLOADS_QUERY_KEY } from '@/shared/api/query-keys';

/**
 * Admin入稿データ一覧取得フック
 */
export function useAdminUploads(params?: GetAdminUploadsParams) {
  return useQuery({
    queryKey: [...ADMIN_UPLOADS_QUERY_KEY, params],
    queryFn: () => adminUploadApi.getUploads(params),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
