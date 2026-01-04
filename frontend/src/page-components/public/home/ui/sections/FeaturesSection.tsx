import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';

const features = [
  {
    number: '01',
    title: 'Mass & Detail',
    titleJa: '厚みと精密さ',
    description:
      '一般的な3mm/5mmではなく、1cmの厚みを標準に。自立する重厚感と、光の屈折が生み出す美しさ。レーザーカッターによる複雑かつ平滑な断面加工を実現します。',
    stat: '10mm',
    statLabel: '標準厚み',
  },
  {
    number: '02',
    title: 'Large Scale',
    titleJa: '大判対応',
    description:
      '家庭用レーザーカッターでは不可能な、A2サイズまでの大型加工が可能。エントランスサインや大型ディスプレイも、一枚のアクリルから切り出します。',
    stat: 'A2',
    statLabel: '最大サイズ',
  },
  {
    number: '03',
    title: 'One to Mass',
    titleJa: '1個から量産まで',
    description:
      '個人向けの「世界に一つのオーダー」から、企業・店舗向けの「100個単位の什器」まで。自社工場による柔軟な生産体制で、あらゆるニーズにお応えします。',
    stat: '1個〜',
    statLabel: '最小ロット',
  },
];

export function FeaturesSection() {
  return (
    <section className='bg-secondary/30 py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Section Header */}
        <div className='mb-20 text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Why ACRIQUE
          </p>
          <h2 className='mt-6 text-3xl font-light md:text-4xl'>
            選ばれる、3つの理由
          </h2>
        </div>

        {/* Features Grid */}
        <div className='space-y-24'>
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className={index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}>
                <div className='relative'>
                  <ImagePlaceholder
                    aspect='16/9'
                    variant='gradient'
                    label={feature.titleJa}
                    className='rounded-sm shadow-lg'
                  />
                  {/* Stat Badge */}
                  <div className='absolute -bottom-6 -right-6 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-foreground text-background shadow-xl'>
                    <span className='text-2xl font-light'>{feature.stat}</span>
                    <span className='text-[10px] uppercase tracking-wider opacity-70'>
                      {feature.statLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}>
                <div className='flex items-baseline gap-4'>
                  <span className='text-6xl font-extralight text-muted-foreground/30'>
                    {feature.number}
                  </span>
                  <div>
                    <h3 className='text-2xl font-light'>{feature.title}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {feature.titleJa}
                    </p>
                  </div>
                </div>
                <p className='mt-6 leading-relaxed text-muted-foreground'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
