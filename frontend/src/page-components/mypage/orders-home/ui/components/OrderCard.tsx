import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import type { Order } from '@/entities/checkout-domain/order/model/types';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
} from '@/shared/domain/order/model/types';
import { formatDate } from '@/shared/utils/format/date';
import { formatPrice } from '@/shared/utils/format/price';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link href={`/mypage/orders/${order.id}`} className='group block'>
      <Card className='transition-colors hover:border-foreground/30'>
        <CardContent className='p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            {/* Order Info */}
            <div className='min-w-0 flex-1 space-y-3'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='font-medium'>{order.order_number}</span>
                <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>

              <div className='grid gap-2 text-sm sm:grid-cols-2'>
                <div>
                  <span className='text-muted-foreground'>注文日: </span>
                  <span>{formatDate(order.created_at, 'long')}</span>
                </div>
                {order.shipped_at && (
                  <div>
                    <span className='text-muted-foreground'>発送日: </span>
                    <span>{formatDate(order.shipped_at, 'long')}</span>
                  </div>
                )}
              </div>

              {order.tracking_number && (
                <p className='text-sm text-muted-foreground'>
                  追跡番号: {order.tracking_number}
                </p>
              )}
            </div>

            {/* Price & Action */}
            <div className='flex items-center justify-between gap-4 border-t border-border pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0'>
              <div className='text-right'>
                <p className='text-xs text-muted-foreground'>合計</p>
                <p className='text-lg font-light'>{formatPrice(order.total)}</p>
              </div>
              <ArrowRight className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1' />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
