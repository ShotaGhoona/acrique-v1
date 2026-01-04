'use client';

import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
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
import { AdminLayout } from '@/widgets/admin-layout/ui/AdminLayout';
import {
  getOrderById,
  orderStatusLabels,
  orderStatusColors,
  type OrderStatus,
} from '../../dummy-data/orders';

interface OrderDetailContainerProps {
  orderId: string;
}

export function OrderDetailContainer({ orderId }: OrderDetailContainerProps) {
  const order = getOrderById(orderId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

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
    <AdminLayout title={`注文詳細: ${order.id}`}>
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
            defaultValue={order.status}
            onValueChange={(value) =>
              alert(
                `ステータスを「${orderStatusLabels[value as OrderStatus]}」に変更（未実装）`,
              )
            }
          >
            <SelectTrigger className='w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(orderStatusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => alert('注文を更新（未実装）')}>保存</Button>
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
                        {item.productName}
                      </TableCell>
                      <TableCell className='text-right'>
                        {item.quantity}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className='text-right font-medium'>
                      合計
                    </TableCell>
                    <TableCell className='text-right text-lg font-bold'>
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <Truck className='h-5 w-5' />
              <CardTitle>配送情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    配送先住所
                  </span>
                  <p className='font-medium'>{order.shippingAddress}</p>
                </div>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    配送ステータス
                  </span>
                  <div className='mt-1'>
                    <Badge variant={orderStatusColors[order.status]}>
                      {orderStatusLabels[order.status]}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Customer Info */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <User className='h-5 w-5' />
              <CardTitle>顧客情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div>
                <span className='text-sm text-muted-foreground'>氏名</span>
                <p className='font-medium'>{order.customerName}</p>
              </div>
              <div>
                <span className='text-sm text-muted-foreground'>
                  メールアドレス
                </span>
                <p className='font-medium'>{order.customerEmail}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              <CardTitle>決済情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div>
                <span className='text-sm text-muted-foreground'>決済状況</span>
                <div className='mt-1'>
                  <Badge
                    variant={
                      order.paymentStatus === 'paid'
                        ? 'outline'
                        : order.paymentStatus === 'refunded'
                          ? 'destructive'
                          : 'default'
                    }
                  >
                    {order.paymentStatus === 'paid'
                      ? '支払済'
                      : order.paymentStatus === 'refunded'
                        ? '返金済'
                        : '未払い'}
                  </Badge>
                </div>
              </div>
              <div>
                <span className='text-sm text-muted-foreground'>合計金額</span>
                <p className='text-lg font-bold'>
                  {formatCurrency(order.totalAmount)}
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
                    <p className='text-muted-foreground'>{order.createdAt}</p>
                  </div>
                </div>
                <div className='flex gap-3 text-sm'>
                  <div className='mt-1.5 h-2 w-2 rounded-full bg-muted' />
                  <div>
                    <p className='font-medium'>最終更新</p>
                    <p className='text-muted-foreground'>{order.updatedAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
