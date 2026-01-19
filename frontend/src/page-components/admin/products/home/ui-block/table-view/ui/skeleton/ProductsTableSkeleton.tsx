import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/ui/table';

export function ProductsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-12'></TableHead>
          <TableHead>商品ID</TableHead>
          <TableHead>商品名</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead className='text-right'>基本価格</TableHead>
          <TableHead>おすすめ</TableHead>
          <TableHead className='w-12'></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className='h-8 w-8 rounded' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
            <TableCell>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-24' />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className='h-5 w-16 rounded-full' />
            </TableCell>
            <TableCell className='text-right'>
              <Skeleton className='ml-auto h-4 w-20' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-4' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-8 w-8 rounded' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
