import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/entities/catalog-domain/product/api/product-api';
import type { ProductListParams } from '@/entities/catalog-domain/product/model/types';
import type { CategoryId } from '@/shared/domain/category/model/types';

/**
 * 商品一覧を取得するHook
 */
export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });
}

/**
 * カテゴリ別商品一覧を取得するHook
 */
export function useProductsByCategory(
  categoryId: CategoryId,
  params?: Omit<ProductListParams, 'category_id'>,
) {
  return useQuery({
    queryKey: ['products', 'category', categoryId, params],
    queryFn: () =>
      productApi.getProducts({ ...params, category_id: categoryId }),
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });
}
