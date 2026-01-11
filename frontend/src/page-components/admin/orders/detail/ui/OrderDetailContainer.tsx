'use client';

import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
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
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useAdminOrder } from '@/features/admin-order/get-order/lib/use-admin-order';
import { useUpdateOrderStatus } from '@/features/admin-order/update-order-status/lib/use-update-order-status';
import { useUpdateAdminOrder } from '@/features/admin-order/update-order/lib/use-update-admin-order';
import { useShipOrder } from '@/features/admin-order/ship-order/lib/use-ship-order';
import type { OrderStatus } from '@/entities/admin-order/model/types';
import {
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_ORDER_STATUS_VARIANTS,
} from '@/shared/domain/order/model/types';
import { useState } from 'react';

interface OrderDetailContainerProps {
  orderId: string;
}

export function OrderDetailContainer({ orderId }: OrderDetailContainerProps) {
  const orderIdNum = parseInt(orderId, 10);
  const { data, isLoading } = useAdminOrder(orderIdNum);
  const updateStatusMutation = useUpdateOrderStatus();
  const updateOrderMutation = useUpdateAdminOrder();
  const shipOrderMutation = useShipOrder();
  const [adminNotes, setAdminNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateStatusMutation.mutate({
      orderId: orderIdNum,
      data: { status: newStatus },
    });
  };

  const handleSaveNotes = () => {
    updateOrderMutation.mutate({
      orderId: orderIdNum,
      data: { admin_notes: adminNotes },
    });
  };

  const handleShipOrder = () => {
    if (!trackingNumber.trim()) {
      alert('追跡番号を入力してください');
      return;
    }
    shipOrderMutation.mutate({
      orderId: orderIdNum,
      data: { tracking_number: trackingNumber },
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title='注文詳細'>
        <div className='space-y-6'>
          <Skeleton className='h-10 w-32' />
          <div className='grid gap-6 lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2'>
              <Skeleton className='h-64 w-full' />
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

  const order = data?.order;

  if (!order) {
    return (
      <AdminLayout title='注文詳細'>
        <div className='flex flex-col items-center justify-center py-12'>
          <p className='text-muted-foreground'>注文が見つかりません</p>
          <Link href='/admin/orders' className='mt-4'>
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
    <AdminLayout title={`注文詳細: ${order.order_number}`}>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Link href='/admin/orders'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            一覧に戻る
          </Button>
        </Link>
        <div className='flex gap-2'>
          <Select
            value={order.status}
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            disabled={updateStatusMutation.isPending}
          >
            <SelectTrigger className='w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ADMIN_ORDER_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Order Items */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <Package className='h-5 w-5' />
              <CardTitle>注文商品</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品名</TableHead>
                    <TableHead className='text-right'>数量</TableHead>
                    <TableHead className='text-right'>単価</TableHead>
                    <TableHead className='text-right'>小計</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='font-medium'>
                        <div>
                          {item.product_name_ja || item.product_name}
                          {item.options &&
                            Object.keys(item.options).length > 0 && (
                              <div className='mt-1 text-xs text-muted-foreground'>
                                {Object.entries(item.options).map(
                                  ([key, val]) => (
                                    <span key={key} className='mr-2'>
                                      {typeof val === 'object' &&
                                      val !== null &&
                                      'label' in val
                                        ? String(
                                            (val as { label: string }).label,
                                          )
                                        : String(val)}
                                    </span>
                                  ),
                                )}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        {item.quantity}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className='text-right'>
                      小計
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(order.subtotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className='text-right'>
                      送料
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(order.shipping_fee)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className='text-right'>
                      消費税
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(order.tax)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className='text-right font-medium'>
                      合計
                    </TableCell>
                    <TableCell className='text-right text-lg font-bold'>
                      {formatCurrency(order.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <FileText className='h-5 w-5' />
              <CardTitle>管理者メモ</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='admin-notes'>
                  内部メモ（顧客には表示されません）
                </Label>
                <Textarea
                  id='admin-notes'
                  placeholder='管理者用のメモを入力...'
                  defaultValue={order.admin_notes || ''}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleSaveNotes}
                disabled={updateOrderMutation.isPending}
                size='sm'
              >
                {updateOrderMutation.isPending ? '保存中...' : 'メモを保存'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Status & Shipping */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <Truck className='h-5 w-5' />
              <CardTitle>配送情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <span className='text-sm text-muted-foreground'>
                  ステータス
                </span>
                <div className='mt-1'>
                  <Badge variant={ADMIN_ORDER_STATUS_VARIANTS[order.status]}>
                    {ADMIN_ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              </div>
              {order.tracking_number && (
                <div>
                  <span className='text-sm text-muted-foreground'>
                    追跡番号
                  </span>
                  <p className='font-medium'>{order.tracking_number}</p>
                </div>
              )}
              {order.shipped_at && (
                <div>
                  <span className='text-sm text-muted-foreground'>発送日</span>
                  <p className='font-medium'>
                    {new Date(order.shipped_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              )}
              {order.delivered_at && (
                <div>
                  <span className='text-sm text-muted-foreground'>
                    配達完了日
                  </span>
                  <p className='font-medium'>
                    {new Date(order.delivered_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              )}
              {order.status === 'processing' && !order.shipped_at && (
                <div className='space-y-2 border-t pt-3'>
                  <Label htmlFor='tracking-number'>発送処理</Label>
                  <Input
                    id='tracking-number'
                    placeholder='追跡番号を入力'
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <Button
                    onClick={handleShipOrder}
                    disabled={
                      shipOrderMutation.isPending || !trackingNumber.trim()
                    }
                    size='sm'
                    className='w-full'
                  >
                    {shipOrderMutation.isPending
                      ? '発送処理中...'
                      : '発送完了にする'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              <CardTitle>決済情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <span className='text-sm text-muted-foreground'>決済方法</span>
                <p className='font-medium'>
                  {order.payment_method === 'stripe'
                    ? 'クレジットカード'
                    : '銀行振込'}
                </p>
              </div>
              <div>
                <span className='text-sm text-muted-foreground'>決済状況</span>
                <div className='mt-1'>
                  <Badge variant={order.paid_at ? 'outline' : 'default'}>
                    {order.paid_at ? '支払済' : '未払い'}
                  </Badge>
                </div>
              </div>
              {order.paid_at && (
                <div>
                  <span className='text-sm text-muted-foreground'>支払日</span>
                  <p className='font-medium'>
                    {new Date(order.paid_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              )}
              <div>
                <span className='text-sm text-muted-foreground'>合計金額</span>
                <p className='text-lg font-bold'>
                  {formatCurrency(order.total)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex gap-3 text-sm'>
                  <div className='mt-1.5 h-2 w-2 rounded-full bg-primary' />
                  <div>
                    <p className='font-medium'>注文作成</p>
                    <p className='text-muted-foreground'>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString('ja-JP')
                        : '-'}
                    </p>
                  </div>
                </div>
                {order.paid_at && (
                  <div className='flex gap-3 text-sm'>
                    <div className='mt-1.5 h-2 w-2 rounded-full bg-green-500' />
                    <div>
                      <p className='font-medium'>支払完了</p>
                      <p className='text-muted-foreground'>
                        {new Date(order.paid_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                )}
                {order.shipped_at && (
                  <div className='flex gap-3 text-sm'>
                    <div className='mt-1.5 h-2 w-2 rounded-full bg-blue-500' />
                    <div>
                      <p className='font-medium'>発送完了</p>
                      <p className='text-muted-foreground'>
                        {new Date(order.shipped_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                )}
                {order.delivered_at && (
                  <div className='flex gap-3 text-sm'>
                    <div className='mt-1.5 h-2 w-2 rounded-full bg-green-600' />
                    <div>
                      <p className='font-medium'>配達完了</p>
                      <p className='text-muted-foreground'>
                        {new Date(order.delivered_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                )}
                {order.cancelled_at && (
                  <div className='flex gap-3 text-sm'>
                    <div className='mt-1.5 h-2 w-2 rounded-full bg-red-500' />
                    <div>
                      <p className='font-medium'>キャンセル</p>
                      <p className='text-muted-foreground'>
                        {new Date(order.cancelled_at).toLocaleString('ja-JP')}
                      </p>
                      {order.cancel_reason && (
                        <p className='text-muted-foreground'>
                          理由: {order.cancel_reason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>お客様メモ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
