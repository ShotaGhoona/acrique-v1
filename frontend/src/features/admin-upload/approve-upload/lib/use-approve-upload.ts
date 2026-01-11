import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUploadApi } from '@/entities/admin-upload/api/admin-upload-api';
import type {
  ApproveUploadRequest,
  ApproveUploadResponse,
} from '@/entities/admin-upload/model/types';
import {
  ADMIN_UPLOADS_QUERY_KEY,
  ADMIN_UPLOAD_QUERY_KEY,
  ADMIN_ORDERS_QUERY_KEY,
} from '@/shared/api/query-keys';

interface ApproveUploadParams {
  uploadId: number;
  data: ApproveUploadRequest;
}

/**
 * Admin入稿データ承認フック
 */
export function useApproveUpload() {
  const queryClient = useQueryClient();

  return useMutation<ApproveUploadResponse, Error, ApproveUploadParams>({
    mutationFn: ({ uploadId, data }) =>
      adminUploadApi.approveUpload(uploadId, data),
    onSuccess: (response, { uploadId }) => {
      // 一覧と詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ADMIN_UPLOADS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_UPLOAD_QUERY_KEY, uploadId],
      });
      // 注文ステータスが更新された場合、注文一覧も無効化
      if (response.order_status_updated) {
        queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
      }
    },
  });
}
