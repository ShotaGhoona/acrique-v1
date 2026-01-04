'use client';

import { notFound } from 'next/navigation';
import {
  getCategoryById,
  isValidCategoryId,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';
import { useProductsByCategory } from '@/features/product/get-products/lib/use-products';
import { CategoryHeroSection } from './sections/CategoryHeroSection';
import { CategoryProductsSection } from './sections/CategoryProductsSection';
import { CategoryUseCasesSection } from './sections/CategoryUseCasesSection';
import { CategoryFeaturesSection } from './sections/CategoryFeaturesSection';
import { CategoryCTASection } from './sections/CategoryCTASection';

interface CategoryPageProps {
  categoryId: string;
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
  if (!isValidCategoryId(categoryId)) {
    notFound();
  }

  const category = getCategoryById(categoryId as CategoryId);
  const { data, isLoading } = useProductsByCategory(categoryId as CategoryId);
  const products = data?.products ?? [];

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground'>読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero: カテゴリ紹介 */}
      <CategoryHeroSection category={category} productCount={products.length} />

      {/* Products: 商品一覧 */}
      <CategoryProductsSection category={category} products={products} />

      {/* Use Cases: 使用シーン */}
      <CategoryUseCasesSection category={category} />

      {/* Features: 選ばれる理由 */}
      <CategoryFeaturesSection category={category} />

      {/* CTA: お問い合わせ誘導 */}
      <CategoryCTASection category={category} />
    </>
  );
}
