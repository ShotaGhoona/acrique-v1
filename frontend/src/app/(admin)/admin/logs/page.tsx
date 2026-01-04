import type { Metadata } from 'next';
import { LogsContainer } from '@/page-components/admin/logs/ui/LogsContainer';

export const metadata: Metadata = {
  title: '操作ログ | ACRIQUE Admin',
  description: '操作ログの閲覧',
};

export default function AdminLogsPage() {
  return <LogsContainer />;
}
