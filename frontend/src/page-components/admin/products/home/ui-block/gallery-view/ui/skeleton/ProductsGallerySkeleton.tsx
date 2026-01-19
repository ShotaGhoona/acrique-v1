import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

export function ProductsGallerySkeleton() {
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {[...Array(10)].map((_, i) => (
        <div key={i} className='overflow-hidden rounded-lg border bg-card'>
          <Skeleton className='aspect-square w-full' />
          <div className='p-3'>
            <Skeleton className='mb-2 h-5 w-16 rounded-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='mt-1 h-3 w-3/4' />
            <Skeleton className='mt-2 h-4 w-20' />
          </div>
        </div>
      ))}
    </div>
  );
}
