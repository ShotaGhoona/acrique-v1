import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { ctaItems } from '../../config/cta-items';

export function CTASection() {
  return (
    <section className='bg-foreground py-32 text-background'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='grid gap-16 lg:grid-cols-2'>
          {/* Left: Main CTA */}
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/50'>
              Contact
            </p>
            <h2 className='mt-6 text-3xl font-light leading-tight md:text-4xl'>
              あなたの「想い」を
              <br />
              アクリルに刻みませんか
            </h2>
            <p className='mt-6 leading-relaxed text-background/70'>
              ACRIQUEは、お客様一人ひとりのご要望に丁寧にお応えします。
              「こんなものが作りたい」「こんなサイズは可能？」など、
              お気軽にご相談ください。
            </p>
            <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
              <Button
                asChild
                size='lg'
                variant='secondary'
                className='group bg-background text-foreground hover:bg-background/90'
              >
                <Link href='/contact'>
                  <Mail className='mr-2 h-4 w-4' />
                  お問い合わせ
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: CTA Cards */}
          <div className='space-y-6'>
            {ctaItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className='group block rounded-sm border border-background/10 p-6 transition-colors hover:border-background/30 hover:bg-background/5'
              >
                <div className='flex items-start gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full border border-background/20'>
                    <item.icon className='h-5 w-5 text-background/60' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-medium'>{item.title}</h3>
                    <p className='mt-1 text-sm text-background/60'>
                      {item.description}
                    </p>
                    <span className='mt-4 inline-flex items-center text-sm font-medium text-accent transition-colors group-hover:text-accent/80'>
                      {item.linkText}
                      <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className='mt-20 grid grid-cols-2 gap-8 border-t border-background/10 pt-12 md:grid-cols-4'>
          <div className='text-center'>
            <div className='text-3xl font-light'>500+</div>
            <div className='mt-1 text-xs uppercase tracking-wider text-background/50'>
              制作実績
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-light'>98%</div>
            <div className='mt-1 text-xs uppercase tracking-wider text-background/50'>
              顧客満足度
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-light'>3日〜</div>
            <div className='mt-1 text-xs uppercase tracking-wider text-background/50'>
              最短納期
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-light'>全国</div>
            <div className='mt-1 text-xs uppercase tracking-wider text-background/50'>
              配送対応
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
