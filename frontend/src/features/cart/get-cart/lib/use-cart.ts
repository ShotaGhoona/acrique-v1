import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart';

export const CART_QUERY_KEY = ['cart'];

export function useCart() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartApi.getCart(),
    staleTime: 1000 * 60 * 5, // 5分
  });
}
