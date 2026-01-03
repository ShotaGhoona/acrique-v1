import { Cpu, Sparkles, Scale } from 'lucide-react';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';

const craftItems = [
  {
    icon: Cpu,
    title: 'Laser Precision',
    description:
      '0.1mm単位のレーザー出力を調整し、断面を鏡のように仕上げる。精密加工で培った職人の技術です。',
  },
  {
    icon: Sparkles,
    title: 'Light Design',
    description:
      '文字やロゴが空間に浮かび上がる瞬間を計算する。光と影を操るデザイン力で、イメージを形にします。',
  },
  {
    icon: Scale,
    title: 'Quality Control',
    description:
      '一つひとつを目視と計測で検品。量産体制の中でも、妥協のない品質管理を徹底しています。',
  },
];

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
          <div>
            <ImagePlaceholder
              aspect='4/3'
              variant='light'
              label='レーザーカッター'
              className='w-full'
            />
          </div>
          <div>
            <ImagePlaceholder
              aspect='4/3'
              variant='light'
              label='手作業での仕上げ'
              className='w-full'
            />
          </div>
          <div>
            <ImagePlaceholder
              aspect='4/3'
              variant='light'
              label='品質検査'
              className='w-full'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
