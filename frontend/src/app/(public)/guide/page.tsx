import type { Metadata } from 'next';

import { GuidePage } from '@/page-components/guide/GuidePage';

export const metadata: Metadata = {
  title: 'ご利用ガイド | ACRIQUE',
  description: 'ACRIQUEでのお買い物から商品到着までの流れをご案内します。',
};

export default function Page() {
  return <GuidePage />;
}
