import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';

export function HeroSection() {
  return (
    <section className='relative min-h-screen overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0'>
        <Image
          src='/IMG/home-page/hero-background-v1.png'
          alt='ACRIQUEのアクリルプロダクト'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-foreground/60' />
      </div>

      {/* Content */}
      <div className='relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-12'>
        <div className='max-w-2xl'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/60'>
            Premium Acrylic Products
          </p>

          <h1 className='mt-6 text-4xl font-light leading-tight tracking-tight text-background md:text-5xl lg:text-6xl'>
            極上のアクリルを、
            <br />
            <span className='font-normal'>1個から。</span>
          </h1>

          <p className='mt-8 max-w-lg text-base leading-relaxed text-background/70 md:text-lg'>
            1cmの厚み、A2サイズ対応、精密なレーザーカット技術。
            従来の薄く安価なアクリル製品とは一線を画した、
            ハイエンドなプロダクトをお届けします。
          </p>

          <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
            <Button
              asChild
              size='lg'
              className='group bg-background px-8 text-foreground hover:bg-background/90'
            >
              <Link href='/shop'>
                商品を見る
                <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='border-background px-8 text-background hover:bg-background hover:text-foreground'
            >
              <Link href='/about'>ブランドストーリー</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className='mt-12 flex items-center gap-8 border-t border-background/20 pt-8'>
            <div>
              <div className='text-2xl font-light text-background'>1cm</div>
              <div className='text-xs text-background/60'>厚み対応</div>
            </div>
            <div className='h-8 w-px bg-background/20' />
            <div>
              <div className='text-2xl font-light text-background'>A2</div>
              <div className='text-xs text-background/60'>サイズ対応</div>
            </div>
            <div className='h-8 w-px bg-background/20' />
            <div>
              <div className='text-2xl font-light text-background'>1個〜</div>
              <div className='text-xs text-background/60'>小ロット対応</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2'>
        <div className='flex flex-col items-center gap-2 text-background/60'>
          <span className='text-xs uppercase tracking-widest'>Scroll</span>
          <div className='h-12 w-px bg-gradient-to-b from-background/60 to-transparent' />
        </div>
      </div>
    </section>
  );
}
