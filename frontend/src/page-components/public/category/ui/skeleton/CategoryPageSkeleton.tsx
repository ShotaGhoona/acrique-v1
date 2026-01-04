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

export function CategoryPageSkeleton() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className='relative py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16'>
            <div className='flex flex-col justify-center'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='mt-6 h-12 w-3/4' />
              <Skeleton className='mt-2 h-12 w-1/2' />
              <Skeleton className='mt-6 h-6 w-48' />
              <Skeleton className='mt-8 h-20 w-full' />
              <div className='mt-8 flex gap-4'>
                <Skeleton className='h-12 w-32' />
                <Skeleton className='h-12 w-32' />
              </div>
            </div>
            <div className='relative'>
              <Skeleton className='aspect-[4/3] w-full rounded-sm' />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section Skeleton */}
      <section className='bg-secondary/30 py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <div className='mb-12 text-center'>
            <Skeleton className='mx-auto h-4 w-24' />
            <Skeleton className='mx-auto mt-4 h-8 w-48' />
            <Skeleton className='mx-auto mt-4 h-4 w-64' />
          </div>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section Skeleton */}
      <section className='py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <div className='mb-16 text-center'>
            <Skeleton className='mx-auto h-4 w-24' />
            <Skeleton className='mx-auto mt-4 h-8 w-56' />
          </div>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='space-y-4'>
                <Skeleton className='aspect-video w-full rounded-sm' />
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
