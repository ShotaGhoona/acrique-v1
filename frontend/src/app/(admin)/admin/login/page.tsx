import type { Metadata } from 'next';
import { AdminLoginContainer } from '@/page-components/admin/login/ui/AdminLoginContainer';

export const metadata: Metadata = {
  title: '管理者ログイン | ACRIQUE Admin',
  description: 'ACRIQUE管理画面ログイン',
};

export default function AdminLoginPage() {
  return <AdminLoginContainer />;
}
