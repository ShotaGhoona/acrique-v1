import type { Metadata } from 'next';
import { ContactPage } from '@/page-components/storefront/contact/ui/ContactContainer';
import { SITE_INFO } from '@/shared/config/site-info';

export const metadata: Metadata = {
  title: `お問い合わせ | ${SITE_INFO.company.nameShort}`,
  description: `商品に関するご質問、大量注文のご相談など、お気軽にお問い合わせください。通常${SITE_INFO.responseTime.text}にご返信いたします。`,
  openGraph: {
    title: `お問い合わせ | ${SITE_INFO.company.nameShort}`,
    description:
      '商品に関するご質問、大量注文のご相談など、お気軽にお問い合わせください。',
  },
};

export default function ContactPageRoute() {
  return <ContactPage />;
}
