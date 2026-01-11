'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useAdminOrders } from '@/features/admin-order/get-orders/lib/use-admin-orders';
import type { OrderStatus } from '@/entities/admin-order/model/types';
import {
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_ORDER_STATUS_VARIANTS,
} from '@/shared/domain/order/model/types';

export function OrdersHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const { data, isLoading } = useAdminOrders({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? [statusFilter] : undefined,
    limit: 50,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  return (
    <AdminLayout title='注文管理'>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <CardTitle>注文一覧</CardTitle>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='注文番号で検索...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-9 sm:w-64'
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as OrderStatus | 'all')
                }
              >
                <SelectTrigger className='w-full sm:w-40'>
                  <Filter className='mr-2 h-4 w-4' />
                  <SelectValue placeholder='ステータス' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>すべて</SelectItem>
                  {Object.entries(ADMIN_ORDER_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>注文番号</TableHead>
                    <TableHead>合計金額</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>決済</TableHead>
                    <TableHead>注文日時</TableHead>
                    <TableHead className='w-12'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className='font-medium'>
                        {order.order_number}
                      </TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant={ADMIN_ORDER_STATUS_VARIANTS[order.status]}>
                          {ADMIN_ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.paid_at ? 'outline' : 'default'}>
                          {order.paid_at ? '支払済' : '未払い'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString('ja-JP', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye className='mr-2 h-4 w-4' />
                                詳細を見る
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data?.orders.length === 0 && (
                <div className='py-12 text-center text-muted-foreground'>
                  該当する注文がありません
                </div>
              )}

              {data && data.total > data.orders.length && (
                <div className='mt-4 text-center text-sm text-muted-foreground'>
                  {data.total}件中 {data.orders.length}件を表示
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
