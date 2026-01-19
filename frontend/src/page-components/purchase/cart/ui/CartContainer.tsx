'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { formatPrice } from '@/shared/utils/format/price';
import { ErrorState } from '@/shared/ui/components/error-state/ui/ErrorState';
import { useCart } from '@/features/checkout-domain/cart/get-cart/lib/use-cart';
import { useUpdateCartItem } from '@/features/checkout-domain/cart/update-cart-item/lib/use-update-cart-item';
import { useDeleteCartItem } from '@/features/checkout-domain/cart/delete-cart-item/lib/use-delete-cart-item';
import { CartItemCard } from './sections/CartItemCard';
import { CartSummary } from './sections/CartSummary';
import { EmptyCart } from './sections/EmptyCart';
import { CartPageSkeleton } from './skeleton/CartPageSkeleton';

export function CartPage() {
  const { data: cart, isLoading, error } = useCart();
  const updateItemMutation = useUpdateCartItem();
  const deleteItemMutation = useDeleteCartItem();

  // Track which item is being updated/removed
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setUpdatingItemId(itemId);
    updateItemMutation.mutate(
      { itemId, data: { quantity } },
      {
        onSettled: () => setUpdatingItemId(null),
      },
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setRemovingItemId(itemId);
    deleteItemMutation.mutate(itemId, {
      onSettled: () => setRemovingItemId(null),
    });
  };

  // Loading state
  if (isLoading) {
    return <CartPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
        <div className='py-20'>
          <ErrorState
            message='カート情報の取得に失敗しました'
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <>
      <div className='mx-auto max-w-7xl px-6 pb-32 pt-12 lg:px-12 lg:pb-12'>
        {/* Breadcrumb */}
        <nav className='mb-8 flex items-center gap-2 text-xs text-muted-foreground'>
          <Link href='/' className='transition-colors hover:text-foreground'>
            Home
          </Link>
          <ChevronRight className='h-3 w-3' />
          <span className='text-foreground'>カート</span>
        </nav>

        {/* Page Header */}
        <h1 className='mb-8 text-2xl font-light tracking-tight md:text-3xl'>
          ショッピングカート
        </h1>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className='grid gap-8 lg:grid-cols-3'>
            {/* Cart Items */}
            <div className='lg:col-span-2'>
              <div className='rounded-sm border border-border bg-background'>
                <div className='px-4 sm:px-6'>
                  {items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      isUpdating={updatingItemId === item.id}
                      isRemoving={removingItemId === item.id}
                    />
                  ))}
                </div>
              </div>

              {/* Continue Shopping Link */}
              <div className='mt-6'>
                <Link
                  href='/shop'
                  className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                >
                  ← 買い物を続ける
                </Link>
              </div>
            </div>

            {/* Cart Summary - Desktop */}
            <div className='hidden lg:sticky lg:top-24 lg:block lg:self-start'>
              <CartSummary
                subtotal={cart?.subtotal ?? 0}
                tax={cart?.tax ?? 0}
                total={cart?.total ?? 0}
                itemCount={cart?.item_count ?? 0}
                isLoading={
                  updateItemMutation.isPending || deleteItemMutation.isPending
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      {!isEmpty && (
        <div className='fixed bottom-0 left-0 right-0 border-t border-border bg-background p-4 lg:hidden'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-xs text-muted-foreground'>
                合計（税込）
              </p>
              <p className='text-lg font-medium'>
                {formatPrice(cart?.total ?? 0)}
              </p>
            </div>
            <Button asChild size='lg' className='flex-1'>
              <Link href='/checkout'>
                購入手続きへ
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
