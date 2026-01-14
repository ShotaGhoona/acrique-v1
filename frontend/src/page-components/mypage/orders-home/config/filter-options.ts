import type { OrderStatus } from '@/entities/checkout-domain/order/model/types';
import { ORDER_STATUS_LABELS } from '@/shared/domain/order/model/types';

export const filterOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'pending', label: ORDER_STATUS_LABELS.pending },
  { value: 'reviewing', label: ORDER_STATUS_LABELS.reviewing },
  { value: 'revision_required', label: ORDER_STATUS_LABELS.revision_required },
  { value: 'processing', label: ORDER_STATUS_LABELS.processing },
  { value: 'shipped', label: ORDER_STATUS_LABELS.shipped },
  { value: 'delivered', label: ORDER_STATUS_LABELS.delivered },
  { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled },
];
