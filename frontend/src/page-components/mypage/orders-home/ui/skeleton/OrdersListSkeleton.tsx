import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

export function OrdersListSkeleton() {
  return (
    <div className='space-y-4'>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className='h-32 w-full rounded-sm' />
      ))}
    </div>
  );
}
