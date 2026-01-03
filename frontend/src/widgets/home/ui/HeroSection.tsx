import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';

export function HeroSection() {
  return (
    <section className='relative min-h-[90vh] overflow-hidden bg-background'>
      {/* Background Grid Pattern */}
      <div className='absolute inset-0 opacity-[0.02]'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className='relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 py-24 lg:flex-row lg:items-center lg:gap-16 lg:px-12'>
        {/* Text Content */}
        <div className='flex-1 lg:max-w-xl'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Premium Acrylic Products
          </p>

          <h1 className='mt-6 text-4xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl'>
            極上のアクリルを、
            <br />
            <span className='font-normal'>1個から。</span>
          </h1>

          <p className='mt-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg'>
            1cmの厚み、A2サイズ対応、精密なレーザーカット技術。
            従来の薄く安価なアクリル製品とは一線を画した、
            ハイエンドなプロダクトをお届けします。
          </p>

          <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
            <Button asChild size='lg' className='group px-8'>
              <Link href='/shop'>
                商品を見る
                <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
            <Button asChild variant='outline' size='lg' className='px-8'>
              <Link href='/about'>ブランドストーリー</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className='mt-12 flex items-center gap-8 border-t border-border pt-8'>
            <div>
              <div className='text-2xl font-light'>1cm</div>
              <div className='text-xs text-muted-foreground'>厚み対応</div>
            </div>
            <div className='h-8 w-px bg-border' />
            <div>
              <div className='text-2xl font-light'>A2</div>
              <div className='text-xs text-muted-foreground'>サイズ対応</div>
            </div>
            <div className='h-8 w-px bg-border' />
            <div>
              <div className='text-2xl font-light'>1個〜</div>
              <div className='text-xs text-muted-foreground'>小ロット対応</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className='mt-12 flex-1 lg:mt-0'>
          <div className='relative'>
            {/* Main Image */}
            <div className='relative z-10 overflow-hidden rounded-sm shadow-2xl'>
              <ImagePlaceholder
                aspect='4/3'
                variant='gradient'
                label='Hero Image'
                className='w-full'
              />
            </div>
            {/* Decorative Elements */}
            <div className='absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-sm border border-border' />
            <div className='absolute -bottom-8 -right-8 -z-20 h-full w-full rounded-sm bg-accent/10' />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2'>
        <div className='flex flex-col items-center gap-2 text-muted-foreground'>
          <span className='text-xs uppercase tracking-widest'>Scroll</span>
          <div className='h-12 w-px bg-gradient-to-b from-muted-foreground to-transparent' />
        </div>
      </div>
    </section>
  );
}
