/**
 * マイページ用レイアウト
 * 認証チェックはMiddlewareで実施済みのため、ここではレイアウトのみを提供
 */
import { generateAuthenticatedMetadata } from '@/shared/lib/global-metadata';
import type { Metadata } from 'next';
import { Header } from '@/widgets/layout/app-layout/ui/Header';
import { Footer } from '@/widgets/layout/app-layout/ui/Footer';
import { MypageProvider } from '@/shared/contexts/MypageContext';
import { MypageInnerLayout } from '@/widgets/layout/mypage-inner-layout/ui/MypageInnerLayout';

export const metadata: Metadata = generateAuthenticatedMetadata();

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <MypageProvider>
        <MypageInnerLayout>{children}</MypageInnerLayout>
      </MypageProvider>
      <Footer />
    </div>
  );
}
