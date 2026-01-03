import type { Metadata } from 'next';
import { ProductsHomeContainer } from '@/page-components/admin/products/home/ui/ProductsHomeContainer';

export const metadata: Metadata = {
  title: '商品管理 | ACRIQUE Admin',
  description: '商品一覧と管理',
};

export default function AdminProductsPage() {
  return <ProductsHomeContainer />;
}
