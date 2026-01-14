import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi } from '@/entities/admin-domain/admin-product/api/admin-product-api';
import { ADMIN_PRODUCT_QUERY_KEY } from '../../get-product/lib/use-admin-product';

export function useDeleteProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: number;
    }) => adminProductApi.deleteImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_QUERY_KEY });
    },
  });
}
