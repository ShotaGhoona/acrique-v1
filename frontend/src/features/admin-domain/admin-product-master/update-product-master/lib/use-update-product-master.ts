import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductMasterApi } from '@/entities/admin-domain/admin-product-master/api/admin-product-master-api';
import type { UpdateProductMasterRequest } from '@/entities/admin-domain/admin-product-master/model/types';

interface UpdateProductMasterParams {
  masterId: string;
  data: UpdateProductMasterRequest;
}

/**
 * 商品マスタを更新するHook
 */
export function useUpdateProductMaster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ masterId, data }: UpdateProductMasterParams) =>
      adminProductMasterApi.updateProductMaster(masterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'productMasters'] });
      queryClient.invalidateQueries({ queryKey: ['productMasters'] });
    },
  });
}
