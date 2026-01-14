import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadApi } from '@/entities/checkout-domain/upload/api/upload-api';
import type { DeleteUploadResponse } from '@/entities/checkout-domain/upload/model/types';
import { UPLOADS_QUERY_KEY } from '@/shared/api/query-keys';

/**
 * 入稿データ削除フック
 */
export function useDeleteUpload() {
  const queryClient = useQueryClient();

  return useMutation<DeleteUploadResponse, Error, number>({
    mutationFn: (uploadId) => uploadApi.deleteUpload(uploadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UPLOADS_QUERY_KEY });
    },
  });
}
