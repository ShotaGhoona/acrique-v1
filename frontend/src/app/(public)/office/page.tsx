import type { Metadata } from 'next';
import { CategoryPage } from '@/page-components/category/CategoryPage';
import { getCategoryData } from '@/entities/category/model/category-data';

const category = getCategoryData('office');

export const metadata: Metadata = {
  title: `${category?.title} | ACRIQUE`,
  description: category?.longDescription,
  openGraph: {
    title: `${category?.title} - ${category?.tagline} | ACRIQUE`,
    description: category?.longDescription,
  },
};

export default function OfficePage() {
  return <CategoryPage categoryId='office' />;
}
