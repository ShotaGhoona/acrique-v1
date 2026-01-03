import type { Metadata } from 'next';
import { EstimateDetailContainer } from '@/page-components/admin/estimates/detail/ui/EstimateDetailContainer';

export const metadata: Metadata = {
  title: '見積もり詳細 | ACRIQUE Admin',
  description: '見積もり詳細と回答',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEstimateDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <EstimateDetailContainer estimateId={id} />;
}
