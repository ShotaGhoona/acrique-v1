'use client';

import { useState } from 'react';
import { ProductHeroSection } from '@/widgets/product/ui/ProductHeroSection';
import { ProductDetailsSection } from '@/widgets/product/ui/ProductDetailsSection';
import { ProductFAQSection } from '@/widgets/product/ui/ProductFAQSection';
import { RelatedProductsSection } from '@/widgets/product/ui/RelatedProductsSection';
import { StickyCartBar } from '@/widgets/product/ui/StickyCartBar';
import type { ProductDetail } from '@/entities/product';

interface ProductPageProps {
  product: ProductDetail;
}

export function ProductPage({ product }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>(() => {
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
