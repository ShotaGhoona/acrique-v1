import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import type { UpdateCartItemRequest } from '@/entities/cart/model/types';
import { CART_QUERY_KEY } from '../../get-cart/lib/use-cart';

interface UpdateCartItemParams {
  itemId: number;
  data: UpdateCartItemRequest;
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: UpdateCartItemParams) =>
      cartApi.updateCartItem(itemId, data),
    onSuccess: () => {
      // カートのキャッシュを更新
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error: unknown) => {
      console.error('Update cart item failed:', error);
    },
  });
}
