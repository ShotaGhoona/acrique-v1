'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';
import { QuantitySelector } from './QuantitySelector';
import type { CartItem } from '@/entities/cart';

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
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
      className={`flex gap-4 border-b border-border py-6 last:border-b-0 sm:gap-6 ${
        isDisabled ? 'opacity-60' : ''
      }`}
    >
      {/* Product Image */}
      <Link
        href={`/shop/${item.product_id}`}
        className="shrink-0"
      >
        <div className="h-24 w-24 overflow-hidden rounded-sm sm:h-32 sm:w-32">
          {item.product_image_url ? (
            <img
              src={item.product_image_url}
              alt={item.product_name_ja || item.product_name || '商品画像'}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <ImagePlaceholder aspect="1/1" variant="light" className="h-full w-full" />
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Product Name */}
          <Link
            href={`/shop/${item.product_id}`}
            className="transition-colors hover:text-accent"
          >
            <h3 className="text-sm font-medium tracking-wide sm:text-base">
              {item.product_name}
            </h3>
            {item.product_name_ja && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.product_name_ja}
              </p>
            )}
          </Link>

          {/* Options */}
          {optionsList.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {optionsList.map((option, index) => (
                <span
                  key={index}
                  className="inline-block rounded-sm bg-secondary px-2 py-0.5 text-xs"
                >
                  {option}
                </span>
              ))}
            </div>
          )}

          {/* Unit Price */}
          <p className="mt-2 text-xs text-muted-foreground">
            単価: {formatPrice(item.base_price)}
          </p>
        </div>

        {/* Actions Row */}
        <div className="mt-4 flex items-center justify-between">
          {/* Quantity Selector */}
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
            disabled={isDisabled}
          />

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.id)}
            disabled={isDisabled}
            aria-label="商品を削除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium sm:text-base">{formatPrice(item.subtotal)}</p>
      </div>
    </div>
  );
}
