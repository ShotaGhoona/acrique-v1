import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';

export function OrdersEmptyState() {
  return (
    <div className='rounded-sm border border-dashed border-border py-16 text-center'>
      <Package className='mx-auto h-12 w-12 text-muted-foreground/50' />
      <h3 className='mt-4 font-medium'>注文履歴がありません</h3>
      <p className='mt-2 text-sm text-muted-foreground'>
        商品を購入すると、ここに注文履歴が表示されます
      </p>
      <Button asChild className='mt-6'>
        <Link href='/'>
          商品を探す
          <ArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </Button>
    </div>
  );
}
