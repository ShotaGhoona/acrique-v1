import type { Metadata } from 'next';
import { MastersContainer } from '@/page-components/admin/masters/ui/MastersContainer';

export const metadata: Metadata = {
  title: '商品マスタ管理 | ACRIQUE Admin',
  description: '商品マスタ（形状テンプレート）の一覧と管理',
};

export default function AdminMastersPage() {
  return <MastersContainer />;
}
