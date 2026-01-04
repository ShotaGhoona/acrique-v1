import type { Metadata } from 'next';
import { ContactPage } from '@/page-components/public/contact/ui/ContactContainer';

export const metadata: Metadata = {
  title: 'お問い合わせ | ACRIQUE',
  description:
    '商品に関するご質問、大量注文のご相談など、お気軽にお問い合わせください。通常2営業日以内にご返信いたします。',
  openGraph: {
    title: 'お問い合わせ | ACRIQUE',
    description:
      '商品に関するご質問、大量注文のご相談など、お気軽にお問い合わせください。',
  },
};

export default function ContactPageRoute() {
  return <ContactPage />;
}
