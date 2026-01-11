import { useQuery } from '@tanstack/react-query';
import { adminUploadApi } from '@/entities/admin-upload/api/admin-upload-api';
import { ADMIN_UPLOAD_QUERY_KEY } from '@/shared/api/query-keys';

/**
 * Admin入稿データ詳細取得フック
 */
export function useAdminUpload(uploadId: number) {
  return useQuery({
    queryKey: [...ADMIN_UPLOAD_QUERY_KEY, uploadId],
    queryFn: () => adminUploadApi.getUpload(uploadId),
    enabled: !!uploadId,
    staleTime: 1000 * 60 * 5, // 5分
  });
}
