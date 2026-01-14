'use client';

import { useState } from 'react';
import { ProductHeroSection } from './sections/ProductHeroSection';
import { ProductDetailsSection } from './sections/ProductDetailsSection';
import { ProductFAQSection } from './sections/ProductFAQSection';
import { RelatedProductsSection } from './sections/RelatedProductsSection';
import { StickyCartBar } from './sections/StickyCartBar';
import type { ProductDetail } from '@/entities/catalog-domain/product/model/types';

interface ProductPageProps {
  product: ProductDetail;
}

export function ProductPage({ product }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >(() => {
    const initial: Record<number, number> = {};
    product.options.forEach((option) => {
      if (option.values.length > 0) {
        initial[option.id] = option.values[0].id;
      }
    });
    return initial;
  });

  const handleOptionChange = (optionId: number, valueId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: valueId }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  return (
    <main>
      <ProductHeroSection
        product={product}
        selectedOptions={selectedOptions}
        quantity={quantity}
        onOptionChange={handleOptionChange}
        onQuantityChange={handleQuantityChange}
      />
      <ProductDetailsSection product={product} />
      <ProductFAQSection product={product} />
      <RelatedProductsSection product={product} />
      <StickyCartBar
        product={product}
        selectedOptions={selectedOptions}
        quantity={quantity}
      />
    </main>
  );
}
