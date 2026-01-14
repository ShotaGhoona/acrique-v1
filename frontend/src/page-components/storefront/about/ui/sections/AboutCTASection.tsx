import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { SITE_INFO } from '@/shared/config/site-info';

export function AboutCTASection() {
  return (
    <section className='py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='mx-auto max-w-3xl text-center'>
          {/* Quote */}
          <blockquote>
            <p className='text-2xl font-light italic md:text-3xl'>
              「ただそこにあるだけで、美しい」
            </p>
            <p className='mt-6 text-muted-foreground'>
              そんな極上の透明体験を、あなたの手元にお届けできれば幸いです。
            </p>
          </blockquote>

          {/* Signature */}
          <div className='mt-12'>
            <p className='text-sm text-muted-foreground'>
              {SITE_INFO.company.nameShort} 代表
            </p>
            <p className='mt-2 font-medium'>
              {SITE_INFO.company.representativeName}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className='mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
            <Link href='/shop'>
              <Button size='lg' className='min-w-[200px]'>
                商品を見る
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
            <Link href='/contact'>
              <Button variant='outline' size='lg' className='min-w-[200px]'>
                お問い合わせ
              </Button>
            </Link>
          </div>

          {/* Additional Links */}
          <div className='mt-12 flex flex-wrap justify-center gap-8 text-sm'>
            <Link
              href='/shop'
              className='text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline'
            >
              店舗向け商品を見る
            </Link>
            <Link
              href='/office'
              className='text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline'
            >
              オフィス向け商品を見る
            </Link>
            <Link
              href='/you'
              className='text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline'
            >
              個人向け商品を見る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
