import type { Metadata } from 'next';
import { EstimatesHomeContainer } from '@/page-components/admin/estimates/home/ui/EstimatesHomeContainer';

export const metadata: Metadata = {
  title: '見積もり管理 | ACRIQUE Admin',
  description: '見積もり一覧と管理',
};

export default function AdminEstimatesPage() {
  return <EstimatesHomeContainer />;
}
