'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import { ProductPage } from '@/page-components/public/product/ui/ProductDetailContainer';
import { useProduct } from '@/features/product/get-product/lib/use-product';

interface ProductPageParams {
  params: Promise<{ productId: string }>;
}

export default function ShopProductPage({ params }: ProductPageParams) {
  const { productId } = use(params);
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground'>読み込み中...</p>
      </div>
    );
  }

  if (error || !product || product.category_id !== 'shop') {
    notFound();
  }

  return <ProductPage product={product} />;
}
