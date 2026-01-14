import Image from 'next/image';
import { features } from '../../config/features';

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
                  <div className='relative aspect-[16/9] overflow-hidden rounded-sm shadow-lg'>
                    <Image
                      src={feature.image}
                      alt={feature.titleJa}
                      fill
                      className='object-cover'
                    />
                  </div>
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
