import { useQuery } from '@tanstack/react-query';
import { adminProductApi } from '@/entities/admin-product/api/admin-product-api';
import type { GetAdminProductsRequest } from '@/entities/admin-product/model/types';

export const ADMIN_PRODUCTS_QUERY_KEY = ['admin-products'];

export function useAdminProducts(params?: GetAdminProductsRequest) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCTS_QUERY_KEY, params],
    queryFn: () => adminProductApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
