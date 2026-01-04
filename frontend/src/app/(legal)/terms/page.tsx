import type { Metadata } from 'next';

import { TermsPage } from '@/page-components/legal/terms/ui/TermsContainer';

export const metadata: Metadata = {
  title: '利用規約 | ACRIQUE',
  description: 'ACRIQUEのご利用にあたっての規約です。',
};

export default function Page() {
  return <TermsPage />;
}
