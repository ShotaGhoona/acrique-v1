import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/entities/checkout-domain/cart/api/cart-api';
import type { AddToCartRequest } from '@/entities/checkout-domain/cart/model/types';
import { CART_QUERY_KEY } from '../../get-cart/lib/use-cart';

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.addToCart(data),
    onSuccess: () => {
      // カートのキャッシュを更新
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error: unknown) => {
      console.error('Add to cart failed:', error);
    },
  });
}
