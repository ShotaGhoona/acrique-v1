import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi } from '@/entities/admin-product/api/admin-product-api';
import type { UpdateProductRequest } from '@/entities/admin-product/model/types';
import { ADMIN_PRODUCTS_QUERY_KEY } from '../../get-products/lib/use-admin-products';
import { ADMIN_PRODUCT_QUERY_KEY } from '../../get-product/lib/use-admin-product';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductRequest;
    }) => adminProductApi.updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_QUERY_KEY });
    },
  });
}
