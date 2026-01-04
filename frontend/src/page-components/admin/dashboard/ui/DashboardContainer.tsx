'use client';

import {
  ShoppingCart,
  Banknote,
  Clock,
  Upload,
  Users,
  TrendingUp,
  TrendingDown,
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
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import {
  dummyStats,
  dummyRecentOrders,
  dummyRevenueData,
  type RecentOrder,
} from '../dummy-data/dashboard';

const statusLabels: Record<RecentOrder['status'], string> = {
  pending: '未処理',
  processing: '処理中',
  completed: '完了',
  cancelled: 'キャンセル',
};

const statusVariants: Record<
  RecentOrder['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'default',
  processing: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
};

export function DashboardContainer() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  return (
    <AdminLayout title='ダッシュボード'>
      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>総注文数</CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dummyStats.totalOrders.toLocaleString()}
            </div>
            <p className='flex items-center gap-1 text-xs text-muted-foreground'>
              <TrendingUp className='h-3 w-3 text-green-500' />
              前月比 +12%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>総売上</CardTitle>
            <Banknote className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(dummyStats.totalRevenue)}
            </div>
            <p className='flex items-center gap-1 text-xs text-muted-foreground'>
              <TrendingUp className='h-3 w-3 text-green-500' />
              前月比 +8%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>未処理注文</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{dummyStats.pendingOrders}</div>
            <p className='flex items-center gap-1 text-xs text-muted-foreground'>
              <TrendingDown className='h-3 w-3 text-red-500' />
              昨日より +3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>入稿待ち</CardTitle>
            <Upload className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dummyStats.pendingUploads}
            </div>
            <p className='text-xs text-muted-foreground'>確認が必要</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>新規会員</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{dummyStats.newUsers}</div>
            <p className='flex items-center gap-1 text-xs text-muted-foreground'>
              <TrendingUp className='h-3 w-3 text-green-500' />
              今月
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Tables */}
      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>月別売上推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex h-64 items-end gap-2'>
              {dummyRevenueData.map((data, index) => {
                const maxRevenue = Math.max(
                  ...dummyRevenueData.map((d) => d.revenue),
                );
                const height = (data.revenue / maxRevenue) * 100;
                return (
                  <div
                    key={index}
                    className='flex flex-1 flex-col items-center gap-2'
                  >
                    <div
                      className='w-full rounded-t bg-primary transition-all hover:bg-primary/80'
                      style={{ height: `${height}%` }}
                    />
                    <span className='text-xs text-muted-foreground'>
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>最近の注文</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>注文ID</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>金額</TableHead>
                  <TableHead>状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyRecentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className='font-medium'>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatCurrency(order.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
