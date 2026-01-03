import Link from 'next/link';
import { ArrowRight, Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import type { CategoryData } from '@/entities/category/model/category-data';

interface CategoryCTASectionProps {
  category: CategoryData;
}

const contactMethods = [
  {
    icon: Mail,
    title: 'メールで相談',
    description: '24時間受付、翌営業日までにご返信',
    action: 'お問い合わせフォーム',
    href: '/contact',
  },
  {
    icon: Phone,
    title: '電話で相談',
    description: '平日 10:00-18:00',
    action: '03-XXXX-XXXX',
    href: 'tel:03-XXXX-XXXX',
  },
  {
    icon: MessageCircle,
    title: 'LINEで相談',
    description: 'お気軽にメッセージください',
    action: 'LINE公式アカウント',
    href: 'https://line.me/',
  },
];

export function CategoryCTASection({ category }: CategoryCTASectionProps) {
  return (
    <section className='bg-foreground py-32 text-background'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Main CTA */}
        <div className='text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/50'>
            Get Started
          </p>
          <h2 className='mt-6 text-3xl font-light md:text-4xl lg:text-5xl'>
            まずはお気軽に
            <br className='md:hidden' />
            ご相談ください
          </h2>
          <p className='mx-auto mt-6 max-w-2xl text-background/70'>
            「こんなものが作れる？」「納期はどれくらい？」「予算内に収まる？」など、
            どんな些細なことでもお気軽にお問い合わせください。
            専門スタッフが丁寧にご対応いたします。
          </p>

          <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button
              asChild
              size='lg'
              className='bg-background text-foreground hover:bg-background/90'
            >
              <Link href='/contact'>
                無料で相談する
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='border-background/30 text-background hover:bg-background/10'
            >
              <Link href={`/contact?category=${category.id}`}>
                お見積もりを依頼
              </Link>
            </Button>
          </div>
        </div>

        {/* Contact Methods */}
        <div className='mt-20 grid gap-6 md:grid-cols-3'>
          {contactMethods.map((method) => (
            <a
              key={method.title}
              href={method.href}
              className='group rounded-sm border border-background/10 p-6 transition-colors hover:border-background/30 hover:bg-background/5'
            >
              <method.icon className='h-6 w-6 text-background/60' />
              <h3 className='mt-4 font-medium'>{method.title}</h3>
              <p className='mt-1 text-sm text-background/50'>
                {method.description}
              </p>
              <p className='mt-4 text-sm font-medium text-accent'>
                {method.action}
              </p>
            </a>
          ))}
        </div>

        {/* Other Categories */}
        <div className='mt-20 border-t border-background/10 pt-12'>
          <p className='text-center text-sm text-background/50'>
            他のカテゴリも見る
          </p>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-4'>
            {category.id !== 'shop' && (
              <Link
                href='/shop'
                className='rounded-sm border border-background/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-background/10'
              >
                For Shop
              </Link>
            )}
            {category.id !== 'office' && (
              <Link
                href='/office'
                className='rounded-sm border border-background/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-background/10'
              >
                For Office
              </Link>
            )}
            {category.id !== 'you' && (
              <Link
                href='/you'
                className='rounded-sm border border-background/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-background/10'
              >
                For You
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
