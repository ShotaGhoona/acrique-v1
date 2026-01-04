'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-light tracking-tight">
        カートに商品がありません
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        商品を追加してお買い物をお楽しみください
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/shop">
          商品を探す
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
