import type { Metadata } from 'next';
import { CategoryPage } from '@/page-components/public/category/ui/CategoryContainer';
// TODO: 後で消す - API接続時に置換
import { getCategoryById } from '@/shared/domain/category';

const category = getCategoryById('you');

export const metadata: Metadata = {
  title: `${category.name} | ACRIQUE`,
  description: category.longDescription,
  openGraph: {
    title: `${category.name} - ${category.tagline} | ACRIQUE`,
    description: category.longDescription,
  },
};

export default function YouPage() {
  return <CategoryPage categoryId='you' />;
}
