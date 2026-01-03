import { notFound } from 'next/navigation';
// TODO: 後で消す - API接続時に置換
import {
  getCategoryById,
  isValidCategoryId,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';
import { getProductsByCategory } from '@/shared/dummy-data/products';
import { CategoryHeroSection } from '@/widgets/category/ui/CategoryHeroSection';
import { CategoryProductsSection } from '@/widgets/category/ui/CategoryProductsSection';
import { CategoryUseCasesSection } from '@/widgets/category/ui/CategoryUseCasesSection';
import { CategoryFeaturesSection } from '@/widgets/category/ui/CategoryFeaturesSection';
import { CategoryCTASection } from '@/widgets/category/ui/CategoryCTASection';

interface CategoryPageProps {
  categoryId: string;
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
  // TODO: 後で消す - API接続時に置換
  if (!isValidCategoryId(categoryId)) {
    notFound();
  }

  const category = getCategoryById(categoryId as CategoryId);
  const products = getProductsByCategory(categoryId);

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
