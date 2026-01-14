import type { Metadata } from 'next';

import { PrivacyPage } from '@/page-components/info/privacy/ui/PrivacyContainer';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | ACRIQUE',
  description: 'ACRIQUEにおけるお客様の個人情報の取り扱いについて。',
};

export default function Page() {
  return <PrivacyPage />;
}
