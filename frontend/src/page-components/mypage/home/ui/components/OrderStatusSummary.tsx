import { Clock, Truck, CheckCircle } from 'lucide-react';
import type { Order } from '@/entities/checkout-domain/order/model/types';
import { PROCESSING_STATUSES } from '@/shared/domain/order/model/types';

interface OrderStatusSummaryProps {
  orders: Order[];
}

export function OrderStatusSummary({ orders }: OrderStatusSummaryProps) {
  const processing = orders.filter((o) =>
    PROCESSING_STATUSES.includes(o.status),
  ).length;
  const shipped = orders.filter((o) => o.status === 'shipped').length;
  const completed = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='rounded-sm border border-border p-4 text-center'>
        <Clock className='mx-auto h-5 w-5 text-muted-foreground' />
        <p className='mt-2 text-2xl font-light'>{processing}</p>
        <p className='text-xs text-muted-foreground'>処理中</p>
      </div>
      <div className='rounded-sm border border-border p-4 text-center'>
        <Truck className='mx-auto h-5 w-5 text-muted-foreground' />
        <p className='mt-2 text-2xl font-light'>{shipped}</p>
        <p className='text-xs text-muted-foreground'>配送中</p>
      </div>
      <div className='rounded-sm border border-border p-4 text-center'>
        <CheckCircle className='mx-auto h-5 w-5 text-muted-foreground' />
        <p className='mt-2 text-2xl font-light'>{completed}</p>
        <p className='text-xs text-muted-foreground'>完了</p>
      </div>
    </div>
  );
}
