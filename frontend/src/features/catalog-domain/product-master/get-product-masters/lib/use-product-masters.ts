import { useQuery } from '@tanstack/react-query';
import { productMasterApi } from '@/entities/catalog-domain/product-master/api/product-master-api';

/**
 * 商品マスタ一覧を取得するHook
 */
export function useProductMasters() {
  return useQuery({
    queryKey: ['productMasters'],
    queryFn: () => productMasterApi.getProductMasters(),
    staleTime: 1000 * 60 * 10, // 10分キャッシュ（マスタデータは変更頻度低い）
  });
}
