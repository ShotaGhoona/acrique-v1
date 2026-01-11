import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadApi } from '@/entities/upload/api/upload-api';
import type { LinkUploadsResponse } from '@/entities/upload/model/types';
import { UPLOADS_QUERY_KEY } from '@/shared/api/query-keys';

interface LinkUploadsParams {
  orderId: number;
  itemId: number;
  uploadIds: number[];
  quantityIndex: number;
}

/**
 * 入稿データを注文明細に紐付けるフック
 */
export function useLinkUploads() {
  const queryClient = useQueryClient();

  return useMutation<LinkUploadsResponse, Error, LinkUploadsParams>({
    mutationFn: ({ orderId, itemId, uploadIds, quantityIndex }) =>
      uploadApi.linkUploadsToOrderItem(orderId, itemId, {
        upload_ids: uploadIds,
        quantity_index: quantityIndex,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UPLOADS_QUERY_KEY });
    },
  });
}
