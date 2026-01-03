/**
 * 認証済みユーザー用レイアウト
 * 認証チェックはMiddlewareで実施済みのため、ここではレイアウトのみを提供
 * ECサイト: マイページ、チェックアウトなど認証が必要なページで使用
 */
import { generateAuthenticatedMetadata } from '@/shared/lib';
import type { Metadata } from 'next';
import { Header } from '@/widgets/layout/ui/Header';
import { Footer } from '@/widgets/layout/ui/Footer';

export const metadata: Metadata = generateAuthenticatedMetadata();

export default function AuthenticatedLayout({
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
