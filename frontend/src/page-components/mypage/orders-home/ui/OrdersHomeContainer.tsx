'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useMypageContext } from '@/shared/contexts/MypageContext';
import { ErrorState } from '@/shared/ui/components/error-state/ui/ErrorState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { useOrders } from '@/features/checkout-domain/order/get-orders/lib/use-orders';
import { OrdersListSkeleton } from './skeleton/OrdersListSkeleton';
import { OrderCard } from './components/OrderCard';
import { OrdersEmptyState } from './components/OrdersEmptyState';
import { filterOptions } from '../config/filter-options';
import type { OrderStatus } from '@/entities/checkout-domain/order/model/types';

export function OrdersPage() {
  const { setPageMeta } = useMypageContext();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const { data, isLoading, error } = useOrders(
    statusFilter !== 'all' ? { status: statusFilter } : undefined,
  );

  const orders = data?.orders ?? [];

  useEffect(() => {
    setPageMeta({
      title: '注文履歴',
      description: '過去のご注文を確認できます',
    });
  }, [setPageMeta]);

  return (
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
        <ErrorState
          message='注文履歴の読み込みに失敗しました'
          onRetry={() => window.location.reload()}
        />
      ) : orders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
