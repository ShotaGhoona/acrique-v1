'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { MypageLayout } from '@/widgets/layout/mypage-layout/ui/MypageLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Separator } from '@/shared/ui/shadcn/ui/separator';
import { useOrder } from '@/features/order/get-order/lib/use-order';
import { useCancelOrder } from '@/features/order/cancel-order/lib/use-cancel-order';
import { useUploads } from '@/features/upload/get-uploads/lib/use-uploads';
import { OrderDetailSkeleton } from './skeleton/OrderDetailSkeleton';
import type {
  OrderStatus,
  OrderDetail,
  OrderItem,
} from '@/entities/order/model/types';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
} from '@/shared/domain/order/model/types';

interface OrderDetailPageProps {
  orderId: number;
}

const statusIcons: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  reviewing: Clock,
  revision_required: AlertCircle,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle,
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

interface TimelineStep {
  key: string;
  label: string;
  activeLabel?: string;
  completedStatuses: OrderStatus[];
  activeStatuses: OrderStatus[];
}

function OrderTimeline({ order }: { order: OrderDetail }) {
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

function OrderItemRow({ item }: { item: OrderItem }) {
  return (
    <div className='flex items-start gap-4 py-4'>
      <div className='min-w-0 flex-1'>
        <h4 className='font-medium'>{item.product_name}</h4>
        {item.product_name_ja && (
          <p className='text-sm text-muted-foreground'>
            {item.product_name_ja}
          </p>
        )}
        {item.options && Object.keys(item.options).length > 0 && (
          <div className='mt-1 flex flex-wrap gap-1'>
            {Object.entries(item.options).map(([key, value]) => (
              <span
                key={key}
                className='rounded-sm bg-secondary px-2 py-0.5 text-xs text-muted-foreground'
              >
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
        <p className='mt-1 text-sm text-muted-foreground'>
          {formatPrice(item.unit_price)} x {item.quantity}
        </p>
      </div>

      <div className='text-right'>
        <p className='font-medium'>{formatPrice(item.subtotal)}</p>
      </div>
    </div>
  );
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const router = useRouter();
  const { data, isLoading, error } = useOrder(orderId);
  const { data: uploadsData } = useUploads();
  const cancelMutation = useCancelOrder();

  const order = data?.order;
  const allUploads = uploadsData?.uploads ?? [];

  // この注文に紐づくrejectedのuploadを取得
  const rejectedUploads = allUploads.filter(
    (u) => u.order_id === orderId && u.status === 'rejected',
  );

  const canCancel =
    order && order.status === 'pending' && !cancelMutation.isPending;

  const handleCancel = async () => {
    if (!order || !canCancel) return;
    if (!confirm('この注文をキャンセルしますか？')) return;

    cancelMutation.mutate(
      { orderId: order.id, data: {} },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  const copyTrackingNumber = () => {
    if (order?.tracking_number) {
      navigator.clipboard.writeText(order.tracking_number);
    }
  };

  if (isLoading) {
    return (
      <MypageLayout title='注文詳細' description='読み込み中...'>
        <OrderDetailSkeleton />
      </MypageLayout>
    );
  }

  if (error || !order) {
    return (
      <MypageLayout title='注文詳細' description=''>
        <div className='rounded-sm border border-destructive/50 bg-destructive/10 p-8 text-center'>
          <AlertCircle className='mx-auto h-10 w-10 text-destructive' />
          <h3 className='mt-4 font-medium'>注文が見つかりません</h3>
          <p className='mt-2 text-sm text-muted-foreground'>
            注文情報を取得できませんでした
          </p>
          <Button asChild variant='outline' className='mt-6'>
            <Link href='/mypage/orders'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              注文履歴に戻る
            </Link>
          </Button>
        </div>
      </MypageLayout>
    );
  }

  const StatusIcon = statusIcons[order.status];

  return (
    <MypageLayout
      title={`注文 ${order.order_number}`}
      description={`${formatDate(order.created_at)}のご注文`}
    >
      <div className='space-y-8'>
        {/* Back Link */}
        <Link
          href='/mypage/orders'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
          注文履歴に戻る
        </Link>

        {/* Revision Required Alert */}
        {order.status === 'revision_required' && (
          <div className='rounded-sm border-2 border-destructive bg-destructive/10 p-6'>
            <div className='flex items-start gap-4'>
              <AlertCircle className='mt-0.5 h-6 w-6 flex-shrink-0 text-destructive' />
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-destructive'>
                  再入稿が必要です
                </h3>
                <p className='mt-1 text-sm text-muted-foreground'>
                  入稿いただいたデータに問題がありました。以下の差し戻し項目を確認のうえ、修正したデータを再度アップロードしてください。
                </p>

                {rejectedUploads.length > 0 && (
                  <div className='mt-4 space-y-2'>
                    {rejectedUploads.map((upload) => {
                      const item = order.items.find(
                        (i) => i.id === upload.order_item_id,
                      );
                      return (
                        <div
                          key={upload.id}
                          className='rounded-sm border border-destructive/30 bg-background/50 p-3'
                        >
                          <div className='flex items-start justify-between'>
                            <div>
                              <p className='text-sm font-medium'>
                                {item?.product_name_ja ||
                                  item?.product_name ||
                                  upload.file_name}
                                {' - '}
                                {upload.quantity_index}個目
                              </p>
                              {upload.admin_notes && (
                                <p className='mt-1 text-xs text-muted-foreground'>
                                  差し戻し理由: {upload.admin_notes}
                                </p>
                              )}
                            </div>
                            <Badge variant='destructive' className='text-xs'>
                              要対応
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button asChild className='mt-4' size='lg'>
                  <Link href={`/mypage/orders/${order.id}/upload`}>
                    <Upload className='mr-2 h-4 w-4' />
                    データを再入稿する
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Status Card */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-secondary'>
                  <StatusIcon className='h-6 w-6' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant={ORDER_STATUS_VARIANTS[order.status]}
                      className='text-sm'
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {order.status === 'shipped' && order.shipped_at
                      ? `${formatDate(order.shipped_at)}に発送しました`
                      : order.status === 'delivered' && order.delivered_at
                        ? `${formatDate(order.delivered_at)}にお届けしました`
                        : '注文を処理しています'}
                  </p>
                </div>
              </div>

              <div className='flex gap-2'>
                {canCancel && (
                  <Button
                    variant='outline'
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending
                      ? 'キャンセル中...'
                      : '注文をキャンセル'}
                  </Button>
                )}
              </div>
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' && (
              <div className='mt-8 border-t border-border pt-6'>
                <OrderTimeline order={order} />
              </div>
            )}

            {/* Tracking Number */}
            {order.tracking_number && (
              <div className='mt-6 flex items-center gap-4 rounded-sm bg-secondary/30 p-4'>
                <Truck className='h-5 w-5 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground'>追跡番号</p>
                  <p className='font-mono font-medium'>
                    {order.tracking_number}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={copyTrackingNumber}
                >
                  <Copy className='h-4 w-4' />
                </Button>
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={`https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=${order.tracking_number}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    追跡する
                    <ExternalLink className='ml-1 h-3 w-3' />
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>注文内容</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='divide-y divide-border'>
              {order.items.map((item) => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </div>

            <Separator className='my-4' />

            {/* Totals */}
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>小計</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>送料</span>
                <span>{formatPrice(order.shipping_fee)}</span>
              </div>
              <Separator className='my-2' />
              <div className='flex justify-between font-medium'>
                <span>合計</span>
                <span className='text-lg'>{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Info */}
        <div className='grid gap-6 sm:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-sm font-medium uppercase tracking-wider text-muted-foreground'>
                注文情報
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>注文番号</span>
                <span className='font-mono'>{order.order_number}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>注文日</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>支払い方法</span>
                <span>
                  {order.payment_method === 'stripe'
                    ? 'クレジットカード'
                    : order.payment_method === 'bank_transfer'
                      ? '銀行振込'
                      : '-'}
                </span>
              </div>
              {order.paid_at && (
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>支払い日</span>
                  <span>{formatDate(order.paid_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm font-medium uppercase tracking-wider text-muted-foreground'>
                備考
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                {order.notes || '特記事項はありません'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MypageLayout>
  );
}
