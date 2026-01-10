import type { Metadata } from 'next';
import { CheckoutContainer } from '@/page-components/purchase/checkout/home/ui/CheckoutContainer';

export const metadata: Metadata = {
  title: '購入手続き | ACRIQUE',
  description: '配送先とお支払い方法を選択してください。',
};

export default function Page() {
  return <CheckoutContainer />;
}
