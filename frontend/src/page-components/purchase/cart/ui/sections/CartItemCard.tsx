'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { QuantitySelector } from './QuantitySelector';
import type { CartItem } from '@/entities/checkout-domain/cart/model/types';
import { formatPrice } from '@/shared/utils/format/price';

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

function formatOptions(options: Record<string, unknown> | null): string[] {
  if (!options) return [];
  return Object.entries(options).map(([key, value]) => `${key}: ${value}`);
}

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}: CartItemCardProps) {
  const optionsList = formatOptions(item.options);
  const isDisabled = isUpdating || isRemoving;

  return (
    <div
      className={`border-b border-border py-6 last:border-b-0 ${
        isDisabled ? 'opacity-60' : ''
      }`}
    >
      <div className='flex gap-4'>
        {/* Product Image */}
        <Link href={`/shop/${item.product_id}`} className='shrink-0'>
          <div className='relative h-20 w-20 overflow-hidden rounded-sm bg-secondary/30 sm:h-28 sm:w-28'>
            {item.product_image_url ? (
              <Image
                src={item.product_image_url}
                alt={item.product_name_ja || item.product_name || '商品画像'}
                fill
                sizes='112px'
                className='object-cover transition-transform duration-300 hover:scale-105'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-muted-foreground/40'>
                <span className='text-[10px] uppercase tracking-wider'>
                  No Image
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className='flex min-w-0 flex-1 flex-col'>
          {/* Product Name & Price */}
          <div className='flex items-start justify-between gap-2'>
            <Link
              href={`/shop/${item.product_id}`}
              className='min-w-0 transition-colors hover:text-accent'
            >
              <h3 className='truncate text-sm font-medium tracking-wide'>
                {item.product_name}
              </h3>
              {item.product_name_ja && (
                <p className='truncate text-xs text-muted-foreground'>
                  {item.product_name_ja}
                </p>
              )}
            </Link>
            <p className='shrink-0 text-sm font-medium'>
              {formatPrice(item.subtotal)}
            </p>
          </div>

          {/* Unit Price */}
          <p className='mt-1 text-xs text-muted-foreground'>
            単価: {formatPrice(item.base_price)}
          </p>

          {/* Options */}
          {optionsList.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {optionsList.map((option, index) => (
                <span
                  key={index}
                  className='inline-block rounded-sm bg-secondary px-1.5 py-0.5 text-[10px]'
                >
                  {option}
                </span>
              ))}
            </div>
          )}

          {/* Actions Row */}
          <div className='mt-3 flex items-center gap-2'>
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
              disabled={isDisabled}
            />
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-muted-foreground hover:text-destructive'
              onClick={() => onRemove(item.id)}
              disabled={isDisabled}
              aria-label='商品を削除'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
