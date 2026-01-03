import type { Metadata } from 'next';
import { OrderDetailContainer } from '@/page-components/admin/orders/detail/ui/OrderDetailContainer';

export const metadata: Metadata = {
  title: '注文詳細 | ACRIQUE Admin',
  description: '注文詳細と編集',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailContainer orderId={id} />;
}
