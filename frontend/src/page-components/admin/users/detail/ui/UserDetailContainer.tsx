'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  ShoppingCart,
  CreditCard,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
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
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useAdminUser } from '@/features/admin-user/get-user/lib/use-admin-user';
import { useAdminUserOrders } from '@/features/admin-user/get-user-orders/lib/use-admin-user-orders';
import type { OrderStatus } from '@/entities/admin-order/model/types';

const orderStatusLabels: Record<OrderStatus, string> = {
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

interface UserDetailContainerProps {
  userId: string;
}

export function UserDetailContainer({ userId }: UserDetailContainerProps) {
  const userIdNum = parseInt(userId, 10);
  const { data: userData, isLoading: isUserLoading } = useAdminUser(userIdNum);
  const { data: ordersData, isLoading: isOrdersLoading } = useAdminUserOrders(userIdNum, { limit: 5 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  if (isUserLoading) {
    return (
      <AdminLayout title='顧客詳細'>
        <div className='space-y-6'>
          <Skeleton className='h-10 w-32' />
          <div className='grid gap-6 lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2'>
              <Skeleton className='h-48 w-full' />
              <Skeleton className='h-32 w-full' />
            </div>
            <div className='space-y-6'>
              <Skeleton className='h-32 w-full' />
              <Skeleton className='h-32 w-full' />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const user = userData?.user;

  if (!user) {
    return (
      <AdminLayout title='顧客詳細'>
        <div className='flex flex-col items-center justify-center py-12'>
          <p className='text-muted-foreground'>顧客が見つかりません</p>
          <Link href='/admin/users' className='mt-4'>
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              一覧に戻る
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`顧客詳細: ${user.name || user.email}`}>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Link href='/admin/users'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            一覧に戻る
          </Button>
        </Link>
        <Badge variant={user.is_verified ? 'outline' : 'default'} className='text-sm'>
          {user.is_verified ? '認証済み' : '未認証'}
        </Badge>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Basic Info */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <User className='h-5 w-5' />
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='flex items-start gap-3'>
                  <User className='mt-0.5 h-4 w-4 text-muted-foreground' />
                  <div>
                    <span className='text-sm text-muted-foreground'>氏名</span>
                    <p className='font-medium'>{user.name || '-'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Mail className='mt-0.5 h-4 w-4 text-muted-foreground' />
                  <div>
                    <span className='text-sm text-muted-foreground'>
                      メールアドレス
                    </span>
                    <p className='font-medium'>{user.email}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Phone className='mt-0.5 h-4 w-4 text-muted-foreground' />
                  <div>
                    <span className='text-sm text-muted-foreground'>
                      電話番号
                    </span>
                    <p className='font-medium'>{user.phone || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div className='flex items-center gap-2'>
                <ShoppingCart className='h-5 w-5' />
                <CardTitle>注文履歴</CardTitle>
              </div>
              <Button variant='outline' size='sm' asChild>
                <Link href={`/admin/orders?user=${user.id}`}>すべて見る</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className='space-y-2'>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className='h-12 w-full' />
                  ))}
                </div>
              ) : ordersData?.orders && ordersData.orders.length > 0 ? (
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
                    {ordersData.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className='font-medium'>
                          <Link href={`/admin/orders/${order.id}`} className='hover:underline'>
                            {order.order_number}
                          </Link>
                        </TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Badge variant='outline'>
                            {orderStatusLabels[order.status as OrderStatus] || order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString('ja-JP')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  注文履歴がありません
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Stats */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              <CardTitle>購入統計</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>総注文数</span>
                <span className='text-2xl font-bold'>{user.order_count}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>累計購入額</span>
                <span className='text-2xl font-bold'>
                  {formatCurrency(user.total_spent)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>平均注文額</span>
                <span className='font-medium'>
                  {user.order_count > 0
                    ? formatCurrency(user.total_spent / user.order_count)
                    : '-'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>アカウント情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>登録日</span>
                <span>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString('ja-JP')
                    : '-'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>最終更新</span>
                <span>
                  {user.updated_at
                    ? new Date(user.updated_at).toLocaleDateString('ja-JP')
                    : '-'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>アクション</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {/* TODO: ユーザーステータス更新API実装後に有効化 */}
              <Button
                variant='outline'
                className='w-full'
                onClick={() =>
                  alert(`パスワードリセットメール送信: ${user.email}（未実装）`)
                }
              >
                パスワードリセット
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => alert(`メール送信: ${user.email}（未実装）`)}
              >
                メール送信
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
