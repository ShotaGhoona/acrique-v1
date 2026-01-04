import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className='aspect-square w-full rounded-sm' />
      <div className='mt-4 space-y-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
      </div>
    </div>
  );
}

export function ProductsGridSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
      {[...Array(6)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
