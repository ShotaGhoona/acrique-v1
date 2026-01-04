import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrderApi } from '@/entities/admin-order/api/admin-order-api';
import type { ShipOrderRequest } from '@/entities/admin-order/model/types';
import {
  ADMIN_ORDERS_QUERY_KEY,
  ADMIN_ORDER_QUERY_KEY,
  ADMIN_DASHBOARD_QUERY_KEY,
} from '@/shared/api/query-keys';

export function useShipOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: ShipOrderRequest;
    }) => adminOrderApi.shipOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEY });
    },
  });
}
