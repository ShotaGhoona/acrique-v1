import type { Metadata } from 'next';

import { FAQPage } from '@/page-components/info/faq/ui/FAQContainer';

export const metadata: Metadata = {
  title: 'よくあるご質問 | ACRIQUE',
  description: 'ACRIQUEに関するよくあるご質問をまとめました。',
};

export default function Page() {
  return <FAQPage />;
}
