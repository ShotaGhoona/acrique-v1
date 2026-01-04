import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi } from '@/entities/admin-product/api/admin-product-api';
import type { CreateProductRequest } from '@/entities/admin-product/model/types';
import { ADMIN_PRODUCTS_QUERY_KEY } from '../../get-products/lib/use-admin-products';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => adminProductApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}
