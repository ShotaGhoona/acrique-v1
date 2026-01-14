import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/entities/catalog-domain/product/api/product-api';

/**
 * 商品詳細を取得するHook
 */
export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProduct(productId),
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
    enabled: !!productId, // productIdがある場合のみ実行
  });
}

/**
 * 商品オプションを取得するHook
 */
export function useProductOptions(productId: string) {
  return useQuery({
    queryKey: ['product', productId, 'options'],
    queryFn: () => productApi.getProductOptions(productId),
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
    enabled: !!productId,
  });
}

/**
 * 関連商品を取得するHook
 */
export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: ['product', productId, 'related'],
    queryFn: () => productApi.getRelatedProducts(productId),
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
    enabled: !!productId,
  });
}
