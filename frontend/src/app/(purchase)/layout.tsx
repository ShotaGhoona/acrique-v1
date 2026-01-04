/**
 * 購入フロー用レイアウト
 * 認証チェックはMiddlewareで実施済みのため、ここではレイアウトのみを提供
 */
import { generateAuthenticatedMetadata } from '@/shared/lib';
import type { Metadata } from 'next';
import { Header } from '@/widgets/layout/ui/Header';
import { Footer } from '@/widgets/layout/ui/Footer';

export const metadata: Metadata = generateAuthenticatedMetadata();

export default function PurchaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1 bg-secondary/20'>{children}</main>
      <Footer />
    </div>
  );
}
