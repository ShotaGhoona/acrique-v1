import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/entities/product';

/**
 * おすすめ商品を取得するHook
 */
export function useFeaturedProducts(limit?: number) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => productApi.getFeaturedProducts(limit),
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });
}
