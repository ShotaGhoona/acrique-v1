import type { OrderItem } from '@/entities/checkout-domain/order/model/types';
import { formatPrice } from '@/shared/utils/format/price';

interface OrderItemRowProps {
  item: OrderItem;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div className='flex items-start gap-4 py-4'>
      <div className='min-w-0 flex-1'>
        <h4 className='font-medium'>{item.product_name}</h4>
        {item.product_name_ja && (
          <p className='text-sm text-muted-foreground'>
            {item.product_name_ja}
          </p>
        )}
        {item.options && Object.keys(item.options).length > 0 && (
          <div className='mt-1 flex flex-wrap gap-1'>
            {Object.entries(item.options).map(([key, value]) => (
              <span
                key={key}
                className='rounded-sm bg-secondary px-2 py-0.5 text-xs text-muted-foreground'
              >
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
        <p className='mt-1 text-sm text-muted-foreground'>
          {formatPrice(item.unit_price)} x {item.quantity}
        </p>
      </div>

      <div className='text-right'>
        <p className='font-medium'>{formatPrice(item.subtotal)}</p>
      </div>
    </div>
  );
}
