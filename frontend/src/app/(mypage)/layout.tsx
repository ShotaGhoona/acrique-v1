/**
 * マイページ用レイアウト
 * 認証チェックはMiddlewareで実施済みのため、ここではレイアウトのみを提供
 */
import { generateAuthenticatedMetadata } from '@/shared/lib/global-metadata';
import type { Metadata } from 'next';
import { Header } from '@/widgets/common/app-layout/ui/Header';
import { Footer } from '@/widgets/common/app-layout/ui/Footer';
import { MypageProvider } from '@/shared/contexts/MypageContext';
import { MypageInnerLayout } from '@/widgets/mypage/inner-layout/ui/MypageInnerLayout';

export const metadata: Metadata = generateAuthenticatedMetadata();

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <div className='flex-1 pt-16'>
        <MypageProvider>
          <MypageInnerLayout>{children}</MypageInnerLayout>
        </MypageProvider>
      </div>
      <Footer />
    </div>
  );
}
