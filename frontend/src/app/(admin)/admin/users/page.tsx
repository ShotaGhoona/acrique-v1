import type { Metadata } from 'next';
import { UsersHomeContainer } from '@/page-components/admin/users/home/ui/UsersHomeContainer';

export const metadata: Metadata = {
  title: '顧客管理 | ACRIQUE Admin',
  description: '顧客一覧と管理',
};

export default function AdminUsersPage() {
  return <UsersHomeContainer />;
}
