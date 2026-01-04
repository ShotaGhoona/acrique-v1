'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { useCart } from '@/features/cart/get-cart';
import { useUpdateCartItem } from '@/features/cart/update-cart-item';
import { useDeleteCartItem } from '@/features/cart/delete-cart-item';
import { useClearCart } from '@/features/cart/clear-cart';
import { CartItemCard } from '@/widgets/cart/ui/CartItemCard';
import { CartSummary } from '@/widgets/cart/ui/CartSummary';
import { EmptyCart } from '@/widgets/cart/ui/EmptyCart';

export function CartPage() {
  const { data: cart, isLoading, error } = useCart();
  const updateItemMutation = useUpdateCartItem();
  const deleteItemMutation = useDeleteCartItem();
  const clearCartMutation = useClearCart();

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

  const handleClearCart = () => {
    if (window.confirm('カート内のすべての商品を削除しますか？')) {
      clearCartMutation.mutate();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
        <div className='animate-pulse'>
          <div className='h-8 w-48 rounded bg-secondary' />
          <div className='mt-8 grid gap-8 lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='flex gap-4 border-b border-border py-6'>
                  <div className='h-24 w-24 rounded bg-secondary' />
                  <div className='flex-1 space-y-3'>
                    <div className='h-4 w-3/4 rounded bg-secondary' />
                    <div className='h-3 w-1/2 rounded bg-secondary' />
                    <div className='h-3 w-1/4 rounded bg-secondary' />
                  </div>
                  <div className='h-4 w-16 rounded bg-secondary' />
                </div>
              ))}
            </div>
            <div className='h-72 rounded-sm bg-secondary' />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-lg text-destructive'>
            カート情報の取得に失敗しました
          </p>
          <p className='mt-2 text-sm text-muted-foreground'>
            ページを再読み込みしてください
          </p>
          <Button
            variant='outline'
            className='mt-6'
            onClick={() => window.location.reload()}
          >
            再読み込み
          </Button>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      {/* Breadcrumb */}
      <nav className='mb-8 flex items-center gap-2 text-xs text-muted-foreground'>
        <Link href='/' className='transition-colors hover:text-foreground'>
          Home
        </Link>
        <ChevronRight className='h-3 w-3' />
        <span className='text-foreground'>カート</span>
      </nav>

      {/* Page Header */}
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-2xl font-light tracking-tight md:text-3xl'>
          ショッピングカート
        </h1>
        {!isEmpty && (
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-destructive'
            onClick={handleClearCart}
            disabled={clearCartMutation.isPending}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            すべて削除
          </Button>
        )}
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            <div className='rounded-sm border border-border bg-background'>
              <div className='px-6'>
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

          {/* Cart Summary */}
          <div className='lg:sticky lg:top-24 lg:self-start'>
            <CartSummary
              subtotal={cart?.subtotal ?? 0}
              tax={cart?.tax ?? 0}
              total={cart?.total ?? 0}
              itemCount={cart?.item_count ?? 0}
              isLoading={
                updateItemMutation.isPending ||
                deleteItemMutation.isPending ||
                clearCartMutation.isPending
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
