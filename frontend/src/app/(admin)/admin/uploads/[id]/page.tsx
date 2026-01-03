import type { Metadata } from 'next';
import { UploadDetailContainer } from '@/page-components/admin/uploads/detail/ui/UploadDetailContainer';

export const metadata: Metadata = {
  title: '入稿データ詳細 | ACRIQUE Admin',
  description: '入稿データの確認と承認',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUploadDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <UploadDetailContainer uploadId={id} />;
}
