'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type {
  ProductDetail,
  RelatedProduct,
} from '@/entities/product/model/types';
import { useRelatedProducts } from '@/features/product/get-product/lib/use-product';

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
  const { data, isLoading } = useRelatedProducts(product.id);
  const relatedProducts = data?.related_products ?? [];

  if (isLoading) {
    return (
      <section className='bg-secondary/30 py-20 lg:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <div className='text-center text-muted-foreground'>読み込み中...</div>
        </div>
      </section>
    );
  }

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
          {relatedProducts.map((relatedProduct: RelatedProduct) => (
            <Link
              key={relatedProduct.id}
              href={`/${product.category_id}/${relatedProduct.id}`}
              className='group'
            >
              <div className='relative aspect-[4/3] overflow-hidden rounded-sm bg-secondary/30'>
                {relatedProduct.main_image_url ? (
                  <Image
                    src={relatedProduct.main_image_url}
                    alt={relatedProduct.name_ja}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-muted-foreground/40'>
                    <span className='text-xs uppercase tracking-wider'>
                      No Image
                    </span>
                  </div>
                )}
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
