import type { Metadata } from 'next';
import { SettingsContainer } from '@/page-components/admin/settings/ui/SettingsContainer';

export const metadata: Metadata = {
  title: 'サイト設定 | ACRIQUE Admin',
  description: 'サイト設定の管理',
};

export default function AdminSettingsPage() {
  return <SettingsContainer />;
}
