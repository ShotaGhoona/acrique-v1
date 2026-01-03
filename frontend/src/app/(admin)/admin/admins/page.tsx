import type { Metadata } from 'next';
import { AdminsContainer } from '@/page-components/admin/admins/ui/AdminsContainer';

export const metadata: Metadata = {
  title: '管理者一覧 | ACRIQUE Admin',
  description: '管理者一覧と管理',
};

export default function AdminAdminsPage() {
  return <AdminsContainer />;
}
