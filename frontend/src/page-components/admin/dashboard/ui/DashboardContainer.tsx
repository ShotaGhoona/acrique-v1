'use client';

import {
  ShoppingCart,
  Banknote,
  Clock,
  Cog,
  Users,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/ui/table';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useAdminDashboard } from '@/features/admin-dashboard/get-dashboard/lib/use-admin-dashboard';
import { useAdminOrders } from '@/features/admin-order/get-orders/lib/use-admin-orders';
import { StatsChart } from './StatsChart';
import type { OrderStatus } from '@/entities/admin-order/model/types';

const statusLabels: Record<OrderStatus, string> = {
  pending: '未処理',
  awaiting_payment: '支払待ち',
  paid: '支払済み',
  awaiting_data: '入稿待ち',
  data_reviewing: '入稿確認中',
  confirmed: '確定',
  processing: '製作中',
  shipped: '発送済み',
  delivered: '配達完了',
  cancelled: 'キャンセル',
};

const statusVariants: Record<
  OrderStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'default',
  awaiting_payment: 'default',
  paid: 'secondary',
  awaiting_data: 'secondary',
  data_reviewing: 'secondary',
  confirmed: 'secondary',
  processing: 'secondary',
  shipped: 'outline',
  delivered: 'outline',
  cancelled: 'destructive',
};

export function DashboardContainer() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useAdminDashboard();
  const { data: ordersData, isLoading: isOrdersLoading } = useAdminOrders({ limit: 5 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const summary = dashboardData?.summary;

  return (
    <AdminLayout title='ダッシュボード'>
      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>本日の注文</CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isDashboardLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {summary?.today_orders?.toLocaleString() ?? 0}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>今日の受注数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>本日の売上</CardTitle>
            <Banknote className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isDashboardLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <div className='text-2xl font-bold'>
                {formatCurrency(summary?.today_revenue ?? 0)}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>今日の売上金額</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>対応待ち</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isDashboardLoading ? (
              <Skeleton className='h-8 w-12' />
            ) : (
              <div className='text-2xl font-bold'>
                {summary?.pending_orders ?? 0}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>未処理の注文</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>製作中</CardTitle>
            <Cog className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isDashboardLoading ? (
              <Skeleton className='h-8 w-12' />
            ) : (
              <div className='text-2xl font-bold'>
                {summary?.processing_orders ?? 0}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>製作進行中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>新規会員</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isDashboardLoading ? (
              <Skeleton className='h-8 w-12' />
            ) : (
              <div className='text-2xl font-bold'>
                {summary?.new_customers_this_month ?? 0}
              </div>
            )}
            <p className='flex items-center gap-1 text-xs text-muted-foreground'>
              <TrendingUp className='h-3 w-3 text-green-500' />
              今月
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Chart & Recent Orders */}
      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        <StatsChart />
        <Card>
          <CardHeader>
            <CardTitle>最近の注文</CardTitle>
          </CardHeader>
          <CardContent>
            {isOrdersLoading ? (
              <div className='space-y-3'>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className='h-12 w-full' />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>注文番号</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead>日時</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData?.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className='font-medium'>
                        {order.order_number}
                      </TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString('ja-JP', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {ordersData?.orders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className='text-center text-muted-foreground'
                      >
                        注文がありません
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
