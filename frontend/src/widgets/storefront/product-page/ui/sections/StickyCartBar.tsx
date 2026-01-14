'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { useAddToCart } from '@/features/checkout-domain/cart/add-to-cart/lib/use-add-to-cart';
import { useAppSelector } from '@/store/hooks/typed-hooks';
import type { ProductDetail } from '@/entities/catalog-domain/product/model/types';

interface StickyCartBarProps {
  product: ProductDetail;
  selectedOptions: Record<number, number>;
  quantity: number;
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function StickyCartBar({
  product,
  selectedOptions,
  quantity,
}: StickyCartBarProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const addToCartMutation = useAddToCart();

  const [isVisible, setIsVisible] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // スクロール位置に応じて表示/非表示を切り替え
  useEffect(() => {
    const handleScroll = () => {
      // 500px以上スクロールしたら表示
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 価格計算
  const calculateTotalPrice = () => {
    let total = product.base_price;
    product.options.forEach((option) => {
      const selectedValueId = selectedOptions[option.id];
      const selectedValue = option.values.find((v) => v.id === selectedValueId);
      if (selectedValue) {
        total += selectedValue.price_diff;
      }
    });
    return total * quantity;
  };

  // API用オプションオブジェクト構築
  const buildOptionsForApi = () => {
    const options: Record<string, string> = {};
    product.options.forEach((option) => {
      const selectedValueId = selectedOptions[option.id];
      const selectedValue = option.values.find((v) => v.id === selectedValueId);
      if (selectedValue) {
        options[option.name] = selectedValue.label;
      }
    });
    return options;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/${product.category_id}/${product.id}`);
      return;
    }

    addToCartMutation.mutate(
      {
        product_id: product.id,
        quantity,
        options: buildOptionsForApi(),
      },
      {
        onSuccess: () => {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 3000);
        },
      },
    );
  };

  // 選択中のオプションをラベル化
  const getSelectedOptionsLabel = () => {
    return product.options
      .map((option) => {
        const selectedValue = option.values.find(
          (v) => v.id === selectedOptions[option.id],
        );
        return selectedValue?.label;
      })
      .filter(Boolean)
      .join(' / ');
  };

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden'>
      <div className='mx-auto max-w-7xl px-4 py-3'>
        <div className='flex items-center justify-between gap-4'>
          {/* Product Info */}
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-medium'>{product.name_ja}</p>
            <div className='mt-0.5 flex items-center gap-2'>
              <span className='text-lg font-light'>
                {formatPrice(calculateTotalPrice())}
              </span>
              {product.options.length > 0 && (
                <span className='truncate text-xs text-muted-foreground'>
                  {getSelectedOptionsLabel()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          {addedToCart ? (
            <Link href='/cart'>
              <Button size='sm' variant='outline'>
                <Check className='mr-1.5 h-4 w-4' />
                カートを見る
              </Button>
            </Link>
          ) : (
            <Button
              size='sm'
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className='shrink-0'
            >
              {addToCartMutation.isPending ? (
                <Loader2 className='mr-1.5 h-4 w-4 animate-spin' />
              ) : (
                <ShoppingBag className='mr-1.5 h-4 w-4' />
              )}
              カートに追加
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
