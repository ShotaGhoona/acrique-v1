import type { Metadata } from 'next';
import { UploadsHomeContainer } from '@/page-components/admin/uploads/home/ui/UploadsHomeContainer';

export const metadata: Metadata = {
  title: '入稿データ管理 | ACRIQUE Admin',
  description: '入稿データ一覧と管理',
};

export default function AdminUploadsPage() {
  return <UploadsHomeContainer />;
}
