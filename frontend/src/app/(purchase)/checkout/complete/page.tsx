import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutCompleteContainer } from '@/page-components/purchase/checkout-complete/ui/CheckoutCompleteContainer';

export const metadata: Metadata = {
  title: 'ご注文完了 | ACRIQUE',
  description: 'ご注文ありがとうございます。',
};

export default function Page() {
  return (
    <Suspense fallback={<CompleteFallback />}>
      <CheckoutCompleteContainer />
    </Suspense>
  );
}

function CompleteFallback() {
  return (
    <div className='flex min-h-[50vh] items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent' />
    </div>
  );
}
