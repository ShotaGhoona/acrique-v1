import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';

export function AddressesListSkeleton() {
  return (
    <div className='space-y-4'>
      {[...Array(2)].map((_, i) => (
        <Skeleton key={i} className='h-36 w-full rounded-sm' />
      ))}
    </div>
  );
}
