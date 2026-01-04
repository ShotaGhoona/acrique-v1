import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

function CartItemSkeleton() {
  return (
    <div className='flex gap-4 border-b border-border py-6'>
      <Skeleton className='h-24 w-24 rounded' />
      <div className='flex-1 space-y-3'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
        <Skeleton className='h-3 w-1/4' />
      </div>
      <Skeleton className='h-4 w-16' />
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      <Skeleton className='h-8 w-48' />
      <div className='mt-8 grid gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          {[...Array(3)].map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        <Skeleton className='h-72 w-full rounded-sm' />
      </div>
    </div>
  );
}
