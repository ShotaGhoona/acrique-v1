import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import type { Order } from '@/entities/checkout-domain/order/model/types';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
} from '@/shared/domain/order/model/types';
import { formatDate } from '@/shared/utils/format/date';
import { formatPrice } from '@/shared/utils/format/price';

interface RecentOrderItemProps {
  order: Order;
}

export function RecentOrderItem({ order }: RecentOrderItemProps) {
  return (
    <Link
      href={`/mypage/orders/${order.id}`}
      className='group flex items-center justify-between border-b border-border py-4 last:border-0'
    >
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-medium'>{order.order_number}</span>
          <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
        <p className='mt-1 text-sm text-muted-foreground'>
          {formatDate(order.created_at, 'long')}
        </p>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm font-medium'>{formatPrice(order.total)}</span>
        <ArrowRight className='h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1' />
      </div>
    </Link>
  );
}
