import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, AddToCartRequest } from '@/entities/cart';
import { CART_QUERY_KEY } from '../../get-cart';

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
