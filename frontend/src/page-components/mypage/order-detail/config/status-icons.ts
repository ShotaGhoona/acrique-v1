import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  AlertCircle,
} from 'lucide-react';
import type { OrderStatus } from '@/entities/checkout-domain/order/model/types';

export const statusIcons: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  reviewing: Clock,
  revision_required: AlertCircle,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle,
};
