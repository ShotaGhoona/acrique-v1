import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi } from '@/entities/admin-domain/admin-product/api/admin-product-api';
import type { UpdateProductFeaturesRequest } from '@/entities/admin-domain/admin-product/model/types';
import { ADMIN_PRODUCT_QUERY_KEY } from '../../get-product/lib/use-admin-product';

export function useUpdateProductFeatures() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductFeaturesRequest;
    }) => adminProductApi.updateFeatures(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_QUERY_KEY });
    },
  });
}
