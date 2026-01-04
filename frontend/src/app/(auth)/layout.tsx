import type { Metadata } from 'next';
import { generatePublicMetadata } from '@/shared/lib';
import { Header } from '@/widgets/layout/ui/Header';
import { Footer } from '@/widgets/layout/ui/Footer';

export const metadata: Metadata = generatePublicMetadata();

export default function AuthLayout({
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
