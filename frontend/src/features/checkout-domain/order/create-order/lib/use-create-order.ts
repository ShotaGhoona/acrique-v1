import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/entities/checkout-domain/order/api/order-api';
import type { CreateOrderRequest } from '@/entities/checkout-domain/order/model/types';
import { ORDERS_QUERY_KEY } from '../../get-orders/lib/use-orders';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: () => {
      // 注文一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      // カートのキャッシュを更新（カートから作成した場合、カートが空になる）
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: unknown) => {
      console.error('Create order failed:', error);
    },
  });
}
