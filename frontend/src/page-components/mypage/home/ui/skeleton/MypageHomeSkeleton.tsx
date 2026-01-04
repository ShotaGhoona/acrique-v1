import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

export function OrderStatusSummarySkeleton() {
  return (
    <div className='grid grid-cols-3 gap-4'>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className='h-24 w-full rounded-sm' />
      ))}
    </div>
  );
}

export function RecentOrdersSkeleton() {
  return (
    <div className='space-y-4 p-6'>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className='h-12 w-full rounded-sm' />
      ))}
    </div>
  );
}

export function AccountInfoSkeleton() {
  return (
    <div className='space-y-3'>
      <Skeleton className='h-5 w-32' />
      <Skeleton className='h-4 w-48' />
    </div>
  );
}
