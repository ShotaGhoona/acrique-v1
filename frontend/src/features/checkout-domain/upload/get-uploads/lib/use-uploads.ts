import { useQuery } from '@tanstack/react-query';
import { uploadApi } from '@/entities/checkout-domain/upload/api/upload-api';
import { UPLOADS_QUERY_KEY } from '@/shared/api/query-keys';

/**
 * 入稿データ一覧取得フック
 */
export function useUploads() {
  return useQuery({
    queryKey: UPLOADS_QUERY_KEY,
    queryFn: () => uploadApi.getUploads(),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
