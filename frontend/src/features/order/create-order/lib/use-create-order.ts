import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi, CreateOrderRequest } from '@/entities/order';
import { ORDERS_QUERY_KEY } from '../../get-orders';
import { CART_QUERY_KEY } from '@/features/cart/get-cart';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: () => {
      // 注文一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      // カートのキャッシュを更新（カートから作成した場合、カートが空になる）
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error: unknown) => {
      console.error('Create order failed:', error);
    },
  });
}
