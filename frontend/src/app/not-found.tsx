import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/widgets/layout/app-layout/ui/Header';
import { Footer } from '@/widgets/layout/app-layout/ui/Footer';
import { Button } from '@/shared/ui/shadcn/ui/button';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex flex-1 items-center justify-center'>
        <section className='px-6 py-32 text-center lg:px-12'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            404 Error
          </p>
          <h1 className='mt-6 text-4xl font-light md:text-5xl lg:text-6xl'>
            Page Not Found
          </h1>
          <p className='mx-auto mt-6 max-w-md text-muted-foreground'>
            お探しのページは見つかりませんでした。
            <br />
            URLが正しいかご確認ください。
          </p>
          <div className='mt-12'>
            <Button asChild size='lg' className='px-8'>
              <Link href='/'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                トップページへ戻る
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
