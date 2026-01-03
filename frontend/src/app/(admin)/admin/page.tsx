import type { Metadata } from 'next';
import { DashboardContainer } from '@/page-components/admin/dashboard/ui/DashboardContainer';

export const metadata: Metadata = {
  title: 'ダッシュボード | ACRIQUE Admin',
  description: 'ACRIQUE管理画面ダッシュボード',
};

export default function AdminDashboardPage() {
  return <DashboardContainer />;
}
