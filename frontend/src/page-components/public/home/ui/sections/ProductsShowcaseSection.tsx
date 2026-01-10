'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  getAllCategories,
  getCategoryIds,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';
import type { ProductListItem } from '@/entities/product/model/types';
import { useProductsByCategory } from '@/features/product/get-products/lib/use-products';
import { ProductsGridSkeleton } from '../skeleton/ProductsShowcaseSkeleton';

function ProductCard({
  product,
  categoryId,
}: {
  product: ProductListItem;
  categoryId: string;
}) {
  const imageUrl = product.main_image_url ?? product.images[0]?.s3_url;

  return (
    <Link href={`/${categoryId}/${product.id}`} className='group block'>
      <div className='relative aspect-square overflow-hidden rounded-sm bg-secondary/30'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name_ja}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-muted-foreground/40'>
            <span className='text-xs uppercase tracking-wider'>No Image</span>
          </div>
        )}
      </div>
      <div className='mt-4'>
        <h4 className='text-sm font-medium tracking-wide transition-colors group-hover:text-accent'>
          {product.name}
        </h4>
        <p className='mt-1 text-xs text-muted-foreground'>{product.name_ja}</p>
      </div>
    </Link>
  );
}

function CategorySection({
  categoryId,
  reverse = false,
}: {
  categoryId: CategoryId;
  reverse?: boolean;
}) {
  const categories = getAllCategories();
  const category = categories.find((c) => c.id === categoryId)!;
  const { data, isLoading } = useProductsByCategory(categoryId);
  const products = data?.products ?? [];

  return (
    <div className='border-t border-border py-20 first:border-t-0 first:pt-0'>
      <div
        className={`grid gap-12 lg:grid-cols-12 lg:gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}
      >
        {/* Category Info */}
        <div
          className={`lg:col-span-3 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <div className='sticky top-24'>
            <p className='text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
              {category.name}
            </p>
            <h3 className='mt-4 text-2xl font-light italic text-accent'>
              {category.tagline}
            </h3>
            <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
              {category.description}
            </p>
            <Link
              href={category.href}
              className='mt-6 inline-flex items-center text-sm font-medium transition-colors hover:text-accent'
            >
              すべて見る
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`lg:col-span-9 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
        >
          {isLoading ? (
            <ProductsGridSkeleton />
          ) : (
            <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryId={categoryId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductsShowcaseSection() {
  const categoryIds = getCategoryIds();

  return (
    <section className='py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Section Header */}
        <div className='mb-20 text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Products
          </p>
          <h2 className='mt-6 text-3xl font-light md:text-4xl'>
            あらゆるシーンに、
            <br className='md:hidden' />
            アクリルの可能性を
          </h2>
          <p className='mx-auto mt-6 max-w-2xl text-muted-foreground'>
            店舗、オフィス、個人のお客様まで。
            用途に合わせた多彩なプロダクトをご用意しています。
          </p>
        </div>

        {/* Categories */}
        <div className='space-y-0'>
          {categoryIds.map((categoryId, index) => (
            <CategorySection
              key={categoryId}
              categoryId={categoryId}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
