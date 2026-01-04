import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi, CancelOrderRequest } from '@/entities/order';
import { ORDERS_QUERY_KEY } from '../../get-orders';
import { ORDER_QUERY_KEY } from '../../get-order';

interface CancelOrderParams {
  orderId: number;
  data: CancelOrderRequest;
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: CancelOrderParams) =>
      orderApi.cancelOrder(orderId, data),
    onSuccess: (_, variables) => {
      // 注文一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      // 注文詳細のキャッシュを更新
      queryClient.invalidateQueries({
        queryKey: [...ORDER_QUERY_KEY, variables.orderId],
      });
    },
    onError: (error: unknown) => {
      console.error('Cancel order failed:', error);
    },
  });
}
