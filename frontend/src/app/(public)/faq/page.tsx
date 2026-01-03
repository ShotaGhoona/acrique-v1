import type { Metadata } from 'next';

import { FAQPage } from '@/page-components/faq/FAQPage';

export const metadata: Metadata = {
  title: 'よくあるご質問 | ACRIQUE',
  description: 'ACRIQUEに関するよくあるご質問をまとめました。',
};

export default function Page() {
  return <FAQPage />;
}
