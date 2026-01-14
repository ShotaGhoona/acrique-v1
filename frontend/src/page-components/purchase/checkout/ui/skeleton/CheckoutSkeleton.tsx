import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

export function CheckoutSkeleton() {
  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      <Skeleton className='mb-8 h-4 w-48' />
      <Skeleton className='mb-8 h-8 w-32' />
      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-32 w-full' />
        </div>
        <Skeleton className='h-96 w-full' />
      </div>
    </div>
  );
}
