'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { useAdminStats } from '@/features/admin-dashboard/get-stats/lib/use-admin-stats';
import type { StatsPeriod } from '@/entities/admin-dashboard/model/types';

interface StatsChartProps {
  className?: string;
}

export function StatsChart({ className }: StatsChartProps) {
  const [period, setPeriod] = useState<StatsPeriod>('daily');

  const dateRange = useMemo(() => {
    const today = new Date();
    let dateFrom: Date;

    switch (period) {
      case 'daily':
        dateFrom = new Date(today);
        dateFrom.setDate(dateFrom.getDate() - 14);
        break;
      case 'weekly':
        dateFrom = new Date(today);
        dateFrom.setDate(dateFrom.getDate() - 12 * 7);
        break;
      case 'monthly':
        dateFrom = new Date(today);
        dateFrom.setMonth(dateFrom.getMonth() - 12);
        break;
    }

    return {
      date_from: dateFrom.toISOString().split('T')[0],
      date_to: today.toISOString().split('T')[0],
    };
  }, [period]);

  const { data, isLoading } = useAdminStats({
    period,
    ...dateRange,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      notation: 'compact',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (period) {
      case 'daily':
        return `${date.getMonth() + 1}/${date.getDate()}`;
      case 'weekly':
        return `${date.getMonth() + 1}/${date.getDate()}週`;
      case 'monthly':
        return `${date.getMonth() + 1}月`;
    }
  };

  const maxRevenue = useMemo(() => {
    if (!data?.data) return 0;
    return Math.max(...data.data.map((d) => d.revenue), 1);
  }, [data]);

  const periodLabels: Record<StatsPeriod, string> = {
    daily: '日別',
    weekly: '週別',
    monthly: '月別',
  };

  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>売上推移</CardTitle>
        <Select
          value={period}
          onValueChange={(v) => setPeriod(v as StatsPeriod)}
        >
          <SelectTrigger className='w-24'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='daily'>日別</SelectItem>
            <SelectItem value='weekly'>週別</SelectItem>
            <SelectItem value='monthly'>月別</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton className='h-48 w-full' />
            <div className='flex justify-between'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>
        ) : (
          <>
            <div className='flex h-48 items-end gap-1'>
              {data?.data.map((item, index) => {
                const height =
                  maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                return (
                  <div
                    key={index}
                    className='group relative flex flex-1 flex-col items-center'
                  >
                    <div
                      className='w-full rounded-t bg-primary transition-colors hover:bg-primary/80'
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    <div className='absolute bottom-full mb-2 hidden rounded bg-popover px-2 py-1 text-xs shadow-lg group-hover:block'>
                      <div className='font-medium'>{formatDate(item.date)}</div>
                      <div>{formatCurrency(item.revenue)}</div>
                      <div className='text-muted-foreground'>
                        {item.orders}件
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='mt-2 flex justify-between text-xs text-muted-foreground'>
              {data?.data && data.data.length > 0 && (
                <>
                  <span>{formatDate(data.data[0].date)}</span>
                  <span>
                    {formatDate(data.data[data.data.length - 1].date)}
                  </span>
                </>
              )}
            </div>
            <div className='mt-4 flex items-center justify-between border-t pt-4'>
              <div>
                <div className='text-sm text-muted-foreground'>
                  {periodLabels[period]}合計
                </div>
                <div className='text-lg font-bold'>
                  {formatCurrency(data?.summary.total_revenue ?? 0)}
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-muted-foreground'>注文数</div>
                <div className='text-lg font-bold'>
                  {data?.summary.total_orders.toLocaleString() ?? 0}件
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
