import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

export function OrderDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-32 w-full rounded-sm' />
      <Skeleton className='h-64 w-full rounded-sm' />
    </div>
  );
}
