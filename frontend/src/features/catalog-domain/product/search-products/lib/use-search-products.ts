import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/entities/catalog-domain/product/api/product-api';
import type { ProductSearchParams } from '@/entities/catalog-domain/product/model/types';

/**
 * 商品検索Hook
 */
export function useSearchProducts(params: ProductSearchParams) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => productApi.searchProducts(params),
    staleTime: 1000 * 60 * 2, // 2分キャッシュ（検索は短め）
    enabled: !!params.keyword && params.keyword.length > 0,
  });
}
