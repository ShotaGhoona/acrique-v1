import type { Metadata } from 'next';
import { UserDetailContainer } from '@/page-components/admin/users/detail/ui/UserDetailContainer';

export const metadata: Metadata = {
  title: '顧客詳細 | ACRIQUE Admin',
  description: '顧客詳細情報',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <UserDetailContainer userId={id} />;
}
