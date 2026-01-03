'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';
// TODO: 後で消す - API接続時にAPIレスポンス型に置換
import type { ProductDetail } from '@/shared/dummy-data/products';

// 価格フォーマット
function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

interface RelatedProductsSectionProps {
  product: ProductDetail;
}

export function RelatedProductsSection({
  product,
}: RelatedProductsSectionProps) {
  // TODO: 後で消す - API接続時に置換
  const relatedProducts = product.related_products;

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className='bg-secondary/30 py-20 lg:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='flex items-end justify-between'>
          <div>
            <h2 className='text-sm font-medium uppercase tracking-widest text-muted-foreground'>
              Related Products
            </h2>
            <h3 className='mt-4 text-2xl font-light tracking-tight md:text-3xl'>
              関連商品
            </h3>
          </div>
          <Link
            href={`/${product.category_id}`}
            className='hidden items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground sm:flex'
          >
            カテゴリ一覧へ
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        {/* Products Grid */}
        <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              href={`/${relatedProduct.category_id}/${relatedProduct.id}`}
              className='group'
            >
              <div className='overflow-hidden rounded-sm bg-background'>
                <ImagePlaceholder
                  aspect='4/3'
                  variant='light'
                  label={relatedProduct.name_ja}
                  className='w-full transition-transform duration-500 group-hover:scale-105'
                />
              </div>
              <div className='mt-4'>
                <p className='text-xs uppercase tracking-wider text-muted-foreground'>
                  {relatedProduct.name}
                </p>
                <h4 className='mt-1 font-medium transition-colors group-hover:text-muted-foreground'>
                  {relatedProduct.name_ja}
                </h4>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {formatPrice(relatedProduct.base_price)}〜
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Link */}
        <div className='mt-8 text-center sm:hidden'>
          <Link
            href={`/${product.category_id}`}
            className='inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground'
          >
            カテゴリ一覧へ
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  );
}
