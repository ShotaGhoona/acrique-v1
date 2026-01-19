import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductMasterApi } from '@/entities/admin-domain/admin-product-master/api/admin-product-master-api';
import type { CreateProductMasterRequest } from '@/entities/admin-domain/admin-product-master/model/types';

/**
 * 商品マスタを作成するHook
 */
export function useCreateProductMaster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductMasterRequest) =>
      adminProductMasterApi.createProductMaster(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'productMasters'] });
      queryClient.invalidateQueries({ queryKey: ['productMasters'] });
    },
  });
}
