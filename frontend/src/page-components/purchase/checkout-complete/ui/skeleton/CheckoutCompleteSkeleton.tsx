import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

export function CheckoutCompleteSkeleton() {
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
