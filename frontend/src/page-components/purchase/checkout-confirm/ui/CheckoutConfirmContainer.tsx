'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { useQueryClient } from '@tanstack/react-query';
import { CheckoutConfirmSkeleton } from './skeleton/CheckoutConfirmSkeleton';
import { getStripe } from '@/shared/lib/stripe';
import { CardForm } from '@/widgets/purchase/card-form/ui/CardForm';
import {
  useOrder,
  ORDER_QUERY_KEY,
} from '@/features/checkout-domain/order/get-order/lib/use-order';
import { toast } from 'sonner';
import { formatPrice } from '@/shared/utils/format/price';
import { usePaymentIntent } from '../lib/use-payment-intent';

export function CheckoutConfirmContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const orderId = searchParams.get('orderId');

  const { data: orderData, isLoading: isOrderLoading } = useOrder(
    orderId ? Number(orderId) : 0,
  );

  const order = orderData?.order;

  const { clientSecret, paymentAmount } = usePaymentIntent(orderId, order);

  const handleSuccess = () => {
    // 注文キャッシュを無効化して最新のステータスを取得できるようにする
    queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    router.push(`/checkout/complete?orderId=${orderId}`);
  };

  const handleError = (message: string) => {
    toast.error(message);
  };

  if (!orderId) {
    return null;
  }

  if (isOrderLoading || !order) {
    return <CheckoutConfirmSkeleton />;
  }

  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      {/* Breadcrumb */}
      <nav className='mb-8 flex items-center gap-2 text-xs text-muted-foreground'>
        <Link href='/' className='transition-colors hover:text-foreground'>
          Home
        </Link>
        <ChevronRight className='h-3 w-3' />
        <Link href='/cart' className='transition-colors hover:text-foreground'>
          カート
        </Link>
        <ChevronRight className='h-3 w-3' />
        <Link
          href='/checkout'
          className='transition-colors hover:text-foreground'
        >
          購入手続き
        </Link>
        <ChevronRight className='h-3 w-3' />
        <span className='text-foreground'>注文確認</span>
      </nav>

      {/* Page Header */}
      <h1 className='mb-8 text-2xl font-light tracking-tight md:text-3xl'>
        注文確認・お支払い
      </h1>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-8 lg:col-span-2'>
          {/* Order Summary */}
          <section className='rounded-sm border border-border bg-background p-6'>
            <h2 className='mb-4 text-lg font-medium'>ご注文内容</h2>

            <div className='space-y-4'>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between border-b border-border py-4 last:border-0'
                >
                  <div>
                    <p className='font-medium'>
                      {item.product_name_ja || item.product_name}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      数量: {item.quantity}
                    </p>
                  </div>
                  <p className='font-medium'>{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>

            <div className='mt-4 space-y-2 border-t border-border pt-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>小計</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>送料</span>
                <span>{formatPrice(order.shipping_fee)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>消費税</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className='flex justify-between border-t border-border pt-4 text-lg font-medium'>
                <span>合計（税込）</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Payment Form */}
          <section className='rounded-sm border border-border bg-background p-6'>
            <h2 className='mb-4 text-lg font-medium'>お支払い情報</h2>

            {clientSecret ? (
              <Elements stripe={getStripe()}>
                <CardForm
                  clientSecret={clientSecret}
                  amount={paymentAmount}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </Elements>
            ) : (
              <div className='flex items-center justify-center py-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent' />
              </div>
            )}

            {/* Test Card Info (Development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className='mt-6 rounded-sm bg-secondary/50 p-4 text-sm'>
                <p className='font-medium'>テスト用カード</p>
                <p className='mt-1 text-muted-foreground'>
                  番号: 4242 4242 4242 4242
                </p>
                <p className='text-muted-foreground'>
                  有効期限: 12/30（未来の日付）
                </p>
                <p className='text-muted-foreground'>CVC: 123</p>
              </div>
            )}
          </section>
        </div>

        {/* Security Notice */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <div className='rounded-sm border border-border bg-background p-6'>
            <div className='flex items-center gap-2'>
              <ShieldCheck className='h-5 w-5 text-green-600' />
              <h3 className='font-medium'>安全なお支払い</h3>
            </div>
            <p className='mt-3 text-sm text-muted-foreground'>
              お客様のカード情報は、Stripeの安全な決済システムで処理されます。
              当社のサーバーにカード情報が保存されることはありません。
            </p>

            <div className='mt-6 space-y-3 text-sm text-muted-foreground'>
              <p>
                <span className='font-medium text-foreground'>注文番号:</span>{' '}
                {order.order_number}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
