'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';
// TODO: 後で消す - API接続時にAPIレスポンス型に置換
import type { ProductDetail } from '@/shared/dummy-data/products';
// TODO: 後で消す - API接続時に置換
import { getCategoryById, isValidCategoryId } from '@/shared/domain/category';

interface ProductHeroSectionProps {
  product: ProductDetail;
}

// ダミー画像ギャラリー（実際は商品ごとに異なる）
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

// 価格フォーマット
function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function ProductHeroSection({ product }: ProductHeroSectionProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  // TODO: 後で消す - API接続時に置換
  const category = isValidCategoryId(product.category_id)
    ? getCategoryById(product.category_id)
    : null;

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

        <div className='grid gap-12 lg:grid-cols-2 lg:gap-20'>
          {/* Left: Image Gallery */}
          <div>
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

          {/* Right: Product Info */}
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

            {/* Price */}
            <div className='mt-8 border-t border-border pt-8'>
              <div className='flex items-baseline gap-2'>
                <span className='text-3xl font-light'>{formatPrice(product.base_price)}</span>
                <span className='text-sm text-muted-foreground'>〜</span>
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>
                {product.price_note}
              </p>
            </div>

            {/* Lead Time */}
            <div className='mt-6 flex items-center gap-4 rounded-sm bg-secondary/30 px-4 py-3'>
              <Truck className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>納期：{product.lead_time_note}</p>
                <p className='text-xs text-muted-foreground'>
                  オプションにより変動する場合があります
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Button size='lg' className='flex-1'>
                お見積もり・注文へ進む
              </Button>
              <Button variant='outline' size='lg' className='flex-1'>
                お問い合わせ
              </Button>
            </div>

            {/* Trust Badges */}
            <div className='mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8'>
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
