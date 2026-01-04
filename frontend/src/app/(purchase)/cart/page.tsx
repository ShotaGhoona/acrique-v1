import type { Metadata } from 'next';
import { CartPage } from '@/page-components/purchase/cart/ui/CartContainer';

export const metadata: Metadata = {
  title: 'カート | ACRIQUE',
  description: 'ショッピングカートの内容をご確認ください。',
};

export default function Page() {
  return <CartPage />;
}
