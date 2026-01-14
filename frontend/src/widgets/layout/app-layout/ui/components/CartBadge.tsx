'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { useCart } from '@/features/checkout-domain/cart/get-cart/lib/use-cart';
import { useAppSelector } from '@/store/hooks/typed-hooks';

interface CartBadgeProps {
  showBadge?: boolean;
  className?: string;
}

export function CartBadge({
  showBadge = true,
  className = '',
}: CartBadgeProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: cart } = useCart();

  // Only show count when authenticated and cart data exists
  const itemCount = isAuthenticated && cart ? cart.item_count : 0;

  return (
    <Link href='/cart'>
      <Button
        variant='ghost'
        size='icon'
        className={`relative h-9 w-9 ${className}`}
      >
        <ShoppingBag className='h-4 w-4' />
        {showBadge && itemCount > 0 && (
          <span className='absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] text-background'>
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
