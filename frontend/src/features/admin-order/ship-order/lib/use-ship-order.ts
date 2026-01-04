import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrderApi } from '@/entities/admin-order/api/admin-order-api';
import type { ShipOrderRequest } from '@/entities/admin-order/model/types';
import { ADMIN_ORDERS_QUERY_KEY } from '../../get-orders/lib/use-admin-orders';
import { ADMIN_ORDER_QUERY_KEY } from '../../get-order/lib/use-admin-order';
import { ADMIN_DASHBOARD_QUERY_KEY } from '@/features/admin-dashboard/get-dashboard/lib/use-admin-dashboard';

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
