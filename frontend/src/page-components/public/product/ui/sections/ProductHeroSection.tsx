'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  ShoppingBag,
  Check,
  Loader2,
  Minus,
  Plus,
} from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';
import { useAddToCart } from '@/features/cart/add-to-cart/lib/use-add-to-cart';
import { useAppSelector } from '@/store/hooks/typed-hooks';
import type { ProductDetail } from '@/entities/product/model/types';
import {
  getCategoryById,
  isValidCategoryId,
} from '@/shared/domain/category/data/categories';

interface ProductHeroSectionProps {
  product: ProductDetail;
  selectedOptions: Record<number, number>;
  quantity: number;
  onOptionChange: (optionId: number, valueId: number) => void;
  onQuantityChange: (quantity: number) => void;
}

const galleryImages = [
  { id: 1, label: 'メイン画像' },
  { id: 2, label: '使用イメージ' },
  { id: 3, label: 'サイズ感' },
  { id: 4, label: 'ディテール' },
];

const trustBadges = [
  { icon: Truck, label: '全国送料無料', note: '¥10,000以上' },
  { icon: Shield, label: '品質保証', note: '10年間' },
  { icon: RotateCcw, label: '返品対応', note: '7日以内' },
];

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function ProductHeroSection({
  product,
  selectedOptions,
  quantity,
  onOptionChange,
  onQuantityChange,
}: ProductHeroSectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const addToCartMutation = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const category = isValidCategoryId(product.category_id)
    ? getCategoryById(product.category_id)
    : null;

  // 選択オプションに基づく価格計算
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

  const handleOptionChange = (optionId: number, valueId: number) => {
    onOptionChange(optionId, valueId);
    setAddedToCart(false);
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

  const hasOptions = product.options.length > 0;

  return (
    <section className='py-12 lg:py-20'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Breadcrumb */}
        <nav className='mb-8 flex items-center gap-2 text-xs text-muted-foreground'>
          <Link href='/' className='transition-colors hover:text-foreground'>
            Home
          </Link>
          <ChevronRight className='h-3 w-3' />
          <Link
            href={`/${product.category_id}`}
            className='transition-colors hover:text-foreground'
          >
            {category?.name}
          </Link>
          <ChevronRight className='h-3 w-3' />
          <span className='text-foreground'>{product.name}</span>
        </nav>

        <div className='grid gap-12 lg:grid-cols-2 lg:gap-16'>
          {/* Left: Image Gallery */}
          <div className='lg:sticky lg:top-24 lg:self-start'>
            {/* Main Image */}
            <div className='relative overflow-hidden rounded-sm bg-secondary/30'>
              <ImagePlaceholder
                aspect='1/1'
                variant='light'
                label={galleryImages[selectedImage].label}
                className='w-full'
              />
            </div>

            {/* Thumbnails */}
            <div className='mt-4 grid grid-cols-4 gap-3'>
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-sm transition-all ${
                    selectedImage === index
                      ? 'ring-2 ring-foreground ring-offset-2'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImagePlaceholder
                    aspect='1/1'
                    variant='light'
                    className='w-full'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info & Purchase */}
          <div>
            {/* Category Tag */}
            <div className='mb-4'>
              <span className='inline-block rounded-sm bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider'>
                {category?.name}
              </span>
            </div>

            {/* Title */}
            <h1 className='text-3xl font-light tracking-tight md:text-4xl'>
              {product.name}
            </h1>
            <p className='mt-2 text-lg text-muted-foreground'>
              {product.name_ja}
            </p>

            {/* Tagline */}
            <p className='mt-4 text-lg italic text-accent'>{product.tagline}</p>

            {/* Description */}
            <p className='mt-6 leading-relaxed text-muted-foreground'>
              {product.description}
            </p>

            {/* Options Selection */}
            {hasOptions && (
              <div className='mt-8 space-y-6 border-t border-border pt-8'>
                <h2 className='text-sm font-medium uppercase tracking-wider text-muted-foreground'>
                  オプションを選択
                </h2>
                {product.options.map((option) => (
                  <div key={option.id}>
                    <label className='mb-3 block text-sm font-medium'>
                      {option.name}
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {option.values.map((value) => {
                        const isSelected =
                          selectedOptions[option.id] === value.id;
                        return (
                          <button
                            key={value.id}
                            onClick={() =>
                              handleOptionChange(option.id, value.id)
                            }
                            className={`rounded-sm border px-4 py-2 text-sm transition-all ${
                              isSelected
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border hover:border-foreground'
                            }`}
                          >
                            {value.label}
                            {value.price_diff !== 0 && (
                              <span className='ml-1 text-xs opacity-70'>
                                {value.price_diff > 0 ? '+' : ''}
                                {formatPrice(value.price_diff)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Purchase Section */}
            <div className='mt-8 rounded-sm border border-border bg-background p-6'>
              {/* Price */}
              <div className='flex items-baseline justify-between'>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    価格（税込）
                  </span>
                  <div className='mt-1 text-3xl font-light'>
                    {formatPrice(calculateTotalPrice())}
                  </div>
                </div>
                {/* Quantity */}
                <div className='flex items-center gap-3'>
                  <span className='text-sm text-muted-foreground'>数量</span>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() =>
                        onQuantityChange(Math.max(1, quantity - 1))
                      }
                      disabled={quantity <= 1}
                    >
                      <Minus className='h-3 w-3' />
                    </Button>
                    <span className='w-8 text-center text-sm font-medium tabular-nums'>
                      {quantity}
                    </span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() =>
                        onQuantityChange(Math.min(99, quantity + 1))
                      }
                      disabled={quantity >= 99}
                    >
                      <Plus className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                className='mt-6 w-full'
                size='lg'
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    追加中...
                  </>
                ) : addedToCart ? (
                  <>
                    <Check className='mr-2 h-4 w-4' />
                    カートに追加しました
                  </>
                ) : (
                  <>
                    <ShoppingBag className='mr-2 h-4 w-4' />
                    カートに追加
                  </>
                )}
              </Button>

              {/* Cart Link */}
              {addedToCart && (
                <div className='mt-3 text-center'>
                  <Link
                    href='/cart'
                    className='text-sm text-accent transition-colors hover:underline'
                  >
                    カートを見る →
                  </Link>
                </div>
              )}

              {/* Lead Time */}
              <div className='mt-6 flex items-center gap-3 rounded-sm bg-secondary/30 px-4 py-3'>
                <Truck className='h-5 w-5 shrink-0 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>
                    納期：{product.lead_time_note}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    オプションにより変動する場合があります
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className='mt-8 grid grid-cols-3 gap-4'>
              {trustBadges.map((badge) => (
                <div key={badge.label} className='text-center'>
                  <badge.icon className='mx-auto h-5 w-5 text-muted-foreground' />
                  <p className='mt-2 text-xs font-medium'>{badge.label}</p>
                  <p className='text-[10px] text-muted-foreground'>
                    {badge.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
