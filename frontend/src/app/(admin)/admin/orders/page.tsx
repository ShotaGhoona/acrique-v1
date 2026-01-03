import type { Metadata } from 'next';
import { OrdersHomeContainer } from '@/page-components/admin/orders/home/ui/OrdersHomeContainer';

export const metadata: Metadata = {
  title: '注文管理 | ACRIQUE Admin',
  description: '注文一覧と管理',
};

export default function AdminOrdersPage() {
  return <OrdersHomeContainer />;
}
