import { useQuery } from '@tanstack/react-query';
import { adminProductMasterApi } from '@/entities/admin-domain/admin-product-master/api/admin-product-master-api';
import type { GetAdminProductMastersRequest } from '@/entities/admin-domain/admin-product-master/model/types';

/**
 * 商品マスタ一覧を取得するHook（管理者用）
 */
export function useAdminProductMasters(params?: GetAdminProductMastersRequest) {
  return useQuery({
    queryKey: ['admin', 'productMasters', params],
    queryFn: () => adminProductMasterApi.getProductMasters(params),
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });
}
