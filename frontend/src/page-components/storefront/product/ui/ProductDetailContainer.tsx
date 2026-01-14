'use client';

import { ProductPage as ProductPageWidget } from '@/widgets/storefront/product-page/ui/ProductPage';
import type { ProductDetail } from '@/entities/catalog-domain/product/model/types';

interface ProductDetailContainerProps {
  product: ProductDetail;
}

export function ProductPage({ product }: ProductDetailContainerProps) {
  return <ProductPageWidget product={product} />;
}
