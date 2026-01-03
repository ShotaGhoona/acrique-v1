import type { Metadata } from 'next';
import { ProductNewContainer } from '@/page-components/admin/products/new/ui/ProductNewContainer';

export const metadata: Metadata = {
  title: '商品追加 | ACRIQUE Admin',
  description: '新規商品の追加',
};

export default function AdminProductNewPage() {
  return <ProductNewContainer />;
}
