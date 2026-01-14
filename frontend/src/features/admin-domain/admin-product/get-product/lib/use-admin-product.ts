import { useQuery } from '@tanstack/react-query';
import { adminProductApi } from '@/entities/admin-domain/admin-product/api/admin-product-api';

export const ADMIN_PRODUCT_QUERY_KEY = ['admin-product'];

export function useAdminProduct(productId: string) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCT_QUERY_KEY, productId],
    queryFn: () => adminProductApi.getProduct(productId),
    staleTime: 1000 * 60 * 5, // 5分
    enabled: !!productId,
  });
}
