'use client';

import Image from 'next/image';
import { philosophyItems } from '../../config/philosophy-items';

export function AboutPhilosophySection() {
  return (
    <section className='py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Header */}
        <div className='text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Design Philosophy
          </p>
          <h2 className='mt-6 text-3xl font-light md:text-4xl'>
            Clear & Sharp.
            <br />
            飾らない、純粋な造形。
          </h2>
          <p className='mx-auto mt-6 max-w-2xl text-muted-foreground'>
            私たちのデザインは、引き算の美学に基づいています。
            余計な装飾を削ぎ落とし、素材そのものの美しさを極限まで引き出す。
          </p>
        </div>

        {/* Philosophy Grid */}
        <div className='mt-20 grid gap-8 lg:grid-cols-3'>
          {philosophyItems.map((item, index) => (
            <div key={item.title} className='group relative'>
              {/* Card */}
              <div className='h-full border border-border bg-background p-8 transition-colors group-hover:border-foreground/30'>
                {/* Number */}
                <span className='text-xs text-muted-foreground'>
                  0{index + 1}
                </span>

                {/* Icon */}
                <div className='mt-6'>
                  <item.icon className='h-8 w-8 stroke-[1]' />
                </div>

                {/* Title */}
                <h3 className='mt-6 text-lg font-medium tracking-wide'>
                  {item.title}
                </h3>
                <p className='text-sm text-muted-foreground'>{item.titleJa}</p>

                {/* Description */}
                <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual */}
        <div className='mt-20'>
          <div className='relative aspect-[21/9] w-full'>
            <Image
              src='/IMG/about-page/light-edge-philosophy-v1.png'
              alt='アクリルのエッジが光を反射している様子'
              fill
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
