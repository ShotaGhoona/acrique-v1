import type { Metadata } from 'next';

import { LawPage } from '@/page-components/law/LawPage';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | ACRIQUE',
  description: '特定商取引法第11条に基づく表示です。',
};

export default function Page() {
  return <LawPage />;
}
