'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, Filter } from 'lucide-react';
import { MypageLayout } from '@/widgets/layout/mypage-layout/ui/MypageLayout';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Button } from '@/shared/ui/shadcn/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { useOrders } from '@/features/checkout-domain/order/get-orders/lib/use-orders';
import { OrdersListSkeleton } from './skeleton/OrdersListSkeleton';
import type { Order, OrderStatus } from '@/entities/checkout-domain/order/model/types';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
} from '@/shared/domain/order/model/types';

const filterOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'pending', label: ORDER_STATUS_LABELS.pending },
  { value: 'reviewing', label: ORDER_STATUS_LABELS.reviewing },
  { value: 'revision_required', label: ORDER_STATUS_LABELS.revision_required },
  { value: 'processing', label: ORDER_STATUS_LABELS.processing },
  { value: 'shipped', label: ORDER_STATUS_LABELS.shipped },
  { value: 'delivered', label: ORDER_STATUS_LABELS.delivered },
  { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled },
];

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function OrderCard({ order }: { order: Order }) {
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
                  <span>{formatDate(order.created_at)}</span>
                </div>
                {order.shipped_at && (
                  <div>
                    <span className='text-muted-foreground'>発送日: </span>
                    <span>{formatDate(order.shipped_at)}</span>
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

function EmptyState() {
  return (
    <div className='rounded-sm border border-dashed border-border py-16 text-center'>
      <Package className='mx-auto h-12 w-12 text-muted-foreground/50' />
      <h3 className='mt-4 font-medium'>注文履歴がありません</h3>
      <p className='mt-2 text-sm text-muted-foreground'>
        商品を購入すると、ここに注文履歴が表示されます
      </p>
      <Button asChild className='mt-6'>
        <Link href='/'>
          商品を探す
          <ArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </Button>
    </div>
  );
}

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const { data, isLoading, error } = useOrders(
    statusFilter !== 'all' ? { status: statusFilter } : undefined,
  );

  const orders = data?.orders ?? [];

  return (
    <MypageLayout title='注文履歴' description='過去のご注文を確認できます'>
      <div className='space-y-6'>
        {/* Filter */}
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            {isLoading ? '読み込み中...' : `${orders.length}件の注文`}
          </p>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as OrderStatus | 'all')
              }
            >
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <OrdersListSkeleton />
        ) : error ? (
          <div className='rounded-sm border border-destructive/50 bg-destructive/10 p-6 text-center'>
            <p className='text-destructive'>注文履歴の読み込みに失敗しました</p>
            <Button
              variant='outline'
              size='sm'
              className='mt-4'
              onClick={() => window.location.reload()}
            >
              再読み込み
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='space-y-4'>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </MypageLayout>
  );
}
