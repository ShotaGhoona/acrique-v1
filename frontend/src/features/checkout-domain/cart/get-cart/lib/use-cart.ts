import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/entities/checkout-domain/cart/api/cart-api';
import { useAppSelector } from '@/store/hooks/typed-hooks';

export const CART_QUERY_KEY = ['cart'];

export function useCart() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartApi.getCart(),
    staleTime: 1000 * 60 * 5, // 5分
    enabled: isAuthenticated, // 認証済みの場合のみ実行
  });
}
