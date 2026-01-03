'use client';

import { ProductHeroSection } from '@/widgets/product/ui/ProductHeroSection';
import { ProductDetailsSection } from '@/widgets/product/ui/ProductDetailsSection';
import { ProductOptionsSection } from '@/widgets/product/ui/ProductOptionsSection';
import { ProductFAQSection } from '@/widgets/product/ui/ProductFAQSection';
import { RelatedProductsSection } from '@/widgets/product/ui/RelatedProductsSection';
// TODO: 後で消す - API接続時にAPIレスポンス型に置換
import type { ProductDetail } from '@/shared/dummy-data/products';

interface ProductPageProps {
  product: ProductDetail;
}

export function ProductPage({ product }: ProductPageProps) {
  return (
    <main>
      <ProductHeroSection product={product} />
      <ProductDetailsSection product={product} />
      <ProductOptionsSection product={product} />
      <ProductFAQSection product={product} />
      <RelatedProductsSection product={product} />
    </main>
  );
}
