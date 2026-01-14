import Image from 'next/image';
import { craftItems } from '../../config/craft-items';

export function AboutCraftSection() {
  return (
    <section className='py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Header */}
        <div className='grid gap-12 lg:grid-cols-2 lg:gap-20'>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
              Craftsmanship
            </p>
            <h2 className='mt-6 text-3xl font-light md:text-4xl'>
              光を設計する、
              <br />
              技術と感性の融合。
            </h2>
            <p className='mt-6 text-muted-foreground'>
              ACRIQUEのクリエイションは、精密な加工技術を持つ「エンジニア」と、
              光と影を操る「デザイナー」の対話から生まれます。
            </p>
          </div>

          <div className='flex items-end'>
            <blockquote className='border-l-2 border-accent pl-6'>
              <p className='text-lg font-light italic'>
                「データ」と「物質」の間にある壁を取り払い、
                イメージした美しさをそのまま形にする。
              </p>
            </blockquote>
          </div>
        </div>

        {/* Craft Items */}
        <div className='mt-20 grid gap-8 md:grid-cols-3'>
          {craftItems.map((item) => (
            <div key={item.title} className='group'>
              <div className='flex items-start gap-4'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary'>
                  <item.icon className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-medium tracking-wide'>{item.title}</h3>
                  <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Images */}
        <div className='mt-20 grid gap-4 md:grid-cols-3'>
          <div className='relative aspect-[4/3]'>
            <Image
              src='/IMG/about-page/laser-cutter-v1.png'
              alt='レーザーカッター'
              fill
              className='object-cover'
            />
          </div>
          <div className='relative aspect-[4/3]'>
            <Image
              src='/IMG/about-page/hand-finishing-v1.png'
              alt='手作業での仕上げ'
              fill
              className='object-cover'
            />
          </div>
          <div className='relative aspect-[4/3]'>
            <Image
              src='/IMG/about-page/craft-quality-v1.png'
              alt='品質検査'
              fill
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
