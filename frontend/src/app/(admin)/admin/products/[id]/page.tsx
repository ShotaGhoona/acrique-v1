import type { Metadata } from 'next';
import { ProductEditContainer } from '@/page-components/admin/products/edit/ui/ProductEditContainer';

export const metadata: Metadata = {
  title: '商品編集 | ACRIQUE Admin',
  description: '商品の編集',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductEditContainer productId={id} />;
}
