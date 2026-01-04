import type { Metadata } from 'next';
import { generatePublicMetadata } from '@/shared/lib/global-metadata';
import { Header } from '@/widgets/layout/app-layout/ui/Header';
import { Footer } from '@/widgets/layout/app-layout/ui/Footer';

export const metadata: Metadata = generatePublicMetadata();

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
