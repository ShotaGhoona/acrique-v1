import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

export function OrderUploadSkeleton() {
  return (
    <div className='space-y-8'>
      <Skeleton className='h-4 w-32' />
      <Skeleton className='h-24 w-full' />
      <Skeleton className='h-64 w-full' />
      <Skeleton className='h-64 w-full' />
    </div>
  );
}
