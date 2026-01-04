import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/shared/ui/shadcn/ui/card';

export function ProductEditSkeleton() {
  return (
    <>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Skeleton className='h-9 w-28' />
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-20' />
          <Skeleton className='h-10 w-20' />
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-24' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-28' />
                  <Skeleton className='h-10 w-full' />
                </div>
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-20 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-32 w-full' />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-20' />
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className='aspect-square w-full rounded-lg' />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Category */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-16' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-3 w-28' />
                </div>
                <Skeleton className='h-6 w-10 rounded-full' />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-20' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-10 w-full' />
              </div>
            </CardContent>
          </Card>

          {/* Lead Time */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-12' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-10 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
