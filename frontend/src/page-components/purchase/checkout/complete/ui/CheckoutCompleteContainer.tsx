'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { useOrder } from '@/features/checkout-domain/order/get-order/lib/use-order';

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function CheckoutCompleteContainer() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: orderData, isLoading } = useOrder(
    orderId ? Number(orderId) : 0,
  );

  const order = orderData?.order;

  if (!orderId) {
    return (
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-lg text-muted-foreground'>
            注文情報が見つかりません
          </p>
          <Button asChild className='mt-6'>
            <Link href='/'>トップページへ</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <CompleteSkeleton />;
  }

  return (
    <div className='mx-auto max-w-3xl px-6 py-12 lg:px-12'>
      {/* Success Icon */}
      <div className='flex flex-col items-center text-center'>
        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
          <CheckCircle className='h-10 w-10 text-green-600' />
        </div>

        <h1 className='mt-6 text-2xl font-light tracking-tight md:text-3xl'>
          ご注文ありがとうございます
        </h1>

        <p className='mt-4 text-muted-foreground'>
          ご注文を承りました。確認メールをお送りしましたのでご確認ください。
        </p>
      </div>

      {/* Order Info */}
      {order && (
        <div className='mt-12 rounded-sm border border-border bg-background p-6'>
          <div className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            <h2 className='text-lg font-medium'>ご注文情報</h2>
          </div>

          <div className='mt-6 space-y-4'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>注文番号</span>
              <span className='font-medium'>{order.order_number}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>ご注文日</span>
              <span>
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString('ja-JP')
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>お支払い金額</span>
              <span className='text-lg font-medium'>
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className='mt-6 border-t border-border pt-6'>
            <h3 className='mb-4 font-medium'>ご注文商品</h3>
            <div className='space-y-3'>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between text-sm'
                >
                  <span>
                    {item.product_name_ja || item.product_name} ×{' '}
                    {item.quantity}
                  </span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className='mt-8 rounded-sm border border-border bg-secondary/30 p-6'>
        <h3 className='font-medium'>今後の流れ</h3>
        <ul className='mt-4 space-y-3 text-sm text-muted-foreground'>
          <li className='flex items-start gap-2'>
            <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background'>
              1
            </span>
            <span>
              ご注文確認メールをお送りします。メールが届かない場合はマイページからご確認ください。
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background'>
              2
            </span>
            <span>
              入稿データが必要な商品は、マイページから入稿をお願いいたします。
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background'>
              3
            </span>
            <span>
              商品の準備ができ次第、発送いたします。発送時にはメールでお知らせいたします。
            </span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className='mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center'>
        <Button asChild size='lg'>
          <Link href={`/mypage/orders/${orderId}`}>
            注文詳細を確認
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
        <Button asChild variant='outline' size='lg'>
          <Link href='/'>トップページへ戻る</Link>
        </Button>
      </div>
    </div>
  );
}

function CompleteSkeleton() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-12 lg:px-12'>
      <div className='flex flex-col items-center'>
        <Skeleton className='h-20 w-20 rounded-full' />
        <Skeleton className='mt-6 h-8 w-64' />
        <Skeleton className='mt-4 h-4 w-96' />
      </div>
      <Skeleton className='mt-12 h-64 w-full' />
      <Skeleton className='mt-8 h-48 w-full' />
    </div>
  );
}
