import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutConfirmContainer } from '@/page-components/purchase/checkout-confirm/ui/CheckoutConfirmContainer';

export const metadata: Metadata = {
  title: '注文確認・お支払い | ACRIQUE',
  description: 'ご注文内容を確認し、お支払いを完了してください。',
};

export default function Page() {
  return (
    <Suspense fallback={<ConfirmFallback />}>
      <CheckoutConfirmContainer />
    </Suspense>
  );
}

function ConfirmFallback() {
  return (
    <div className='flex min-h-[50vh] items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent' />
    </div>
  );
}
