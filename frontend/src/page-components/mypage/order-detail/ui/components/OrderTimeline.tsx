import { CheckCircle } from 'lucide-react';
import type {
  OrderStatus,
  OrderDetail,
} from '@/entities/checkout-domain/order/model/types';

interface TimelineStep {
  key: string;
  label: string;
  activeLabel?: string;
  completedStatuses: OrderStatus[];
  activeStatuses: OrderStatus[];
}

interface OrderTimelineProps {
  order: OrderDetail;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const steps: TimelineStep[] = [
    {
      key: 'order',
      label: '注文・支払い',
      completedStatuses: [
        'reviewing',
        'revision_required',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
      ],
      activeStatuses: ['pending'],
    },
    {
      key: 'upload',
      label: 'データ確認',
      activeLabel:
        order.status === 'reviewing'
          ? '確認中'
          : order.status === 'revision_required'
            ? '再入稿待ち'
            : undefined,
      completedStatuses: ['confirmed', 'processing', 'shipped', 'delivered'],
      activeStatuses: ['reviewing', 'revision_required'],
    },
    {
      key: 'production',
      label: '製作',
      activeLabel: '製作中',
      completedStatuses: ['shipped', 'delivered'],
      activeStatuses: ['confirmed', 'processing'],
    },
    {
      key: 'delivery',
      label: 'お届け',
      activeLabel: order.shipped_at ? '配送中' : undefined,
      completedStatuses: ['delivered'],
      activeStatuses: ['shipped'],
    },
  ];

  return (
    <div className='flex items-center justify-between'>
      {steps.map((step, index) => {
        const isCompleted = step.completedStatuses.includes(order.status);
        const isActive = step.activeStatuses.includes(order.status);
        const displayLabel =
          isActive && step.activeLabel ? step.activeLabel : step.label;

        return (
          <div key={step.key} className='flex flex-1 items-center'>
            <div className='flex flex-col items-center'>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isCompleted
                    ? 'bg-foreground text-background'
                    : isActive
                      ? 'border-2 border-foreground bg-background'
                      : 'border border-border bg-background'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className='h-4 w-4' />
                ) : isActive ? (
                  <span className='h-2 w-2 rounded-full bg-foreground' />
                ) : (
                  <span className='text-xs text-muted-foreground'>
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`mt-2 text-center text-xs ${
                  isActive
                    ? 'font-medium text-foreground'
                    : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                }`}
              >
                {displayLabel}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${
                  step.completedStatuses.includes(order.status)
                    ? 'bg-foreground'
                    : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
