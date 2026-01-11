import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { CheckoutUploadContainer } from '@/page-components/purchase/checkout/upload/ui/CheckoutUploadContainer';

export const metadata: Metadata = {
  title: 'データ入稿 | ACRIQUE',
  description: '商品に使用するデータをアップロードしてください',
};

function UploadPageSkeleton() {
  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      <Skeleton className='mb-8 h-4 w-64' />
      <Skeleton className='mb-2 h-8 w-32' />
      <Skeleton className='mb-8 h-4 w-48' />
      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
        <Skeleton className='h-80 w-full' />
      </div>
    </div>
  );
}

export default function CheckoutUploadPage() {
  return (
    <Suspense fallback={<UploadPageSkeleton />}>
      <CheckoutUploadContainer />
    </Suspense>
  );
}
