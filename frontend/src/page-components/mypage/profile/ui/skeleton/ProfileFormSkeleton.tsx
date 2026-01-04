import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';

export function ProfileFormSkeleton() {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
