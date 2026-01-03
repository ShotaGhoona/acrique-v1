import { notFound } from 'next/navigation';
import { getCategoryData } from '@/entities/category/model/category-data';
import { CategoryHeroSection } from '@/widgets/category/ui/CategoryHeroSection';
import { CategoryProductsSection } from '@/widgets/category/ui/CategoryProductsSection';
import { CategoryUseCasesSection } from '@/widgets/category/ui/CategoryUseCasesSection';
import { CategoryFeaturesSection } from '@/widgets/category/ui/CategoryFeaturesSection';
import { CategoryCTASection } from '@/widgets/category/ui/CategoryCTASection';

interface CategoryPageProps {
  categoryId: string;
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
  const category = getCategoryData(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <>
      {/* Hero: カテゴリ紹介 */}
      <CategoryHeroSection category={category} />

      {/* Products: 商品一覧 */}
      <CategoryProductsSection category={category} />

      {/* Use Cases: 使用シーン */}
      <CategoryUseCasesSection category={category} />

      {/* Features: 選ばれる理由 */}
      <CategoryFeaturesSection category={category} />

      {/* CTA: お問い合わせ誘導 */}
      <CategoryCTASection category={category} />
    </>
  );
}
