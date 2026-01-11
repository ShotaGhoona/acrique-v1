import Image from 'next/image';

export function AboutHeroSection() {

  return (
    <section className='relative min-h-screen'>
      {/* Background Image */}
      <div className='absolute inset-0'>
        <Image
          src='/IMG/about-page/hero-background-v1.png'
          alt='1cm厚アクリルの断面クローズアップ'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-foreground/70' />
      </div>

      {/* Content */}
      <div className='relative flex min-h-screen items-center'>
        <div className='mx-auto w-full max-w-7xl px-6 lg:px-12'>
          <div className='max-w-3xl'>
            {/* Label */}
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/50'>
              Our Mission
            </p>

            {/* Main Headline */}
            <h1 className='mt-8 text-4xl font-light leading-tight text-background md:text-5xl lg:text-6xl'>
              透明を、
              <br />
              結晶化する。
            </h1>

            {/* Sub Copy */}
            <p className='mt-8 max-w-xl text-lg leading-relaxed text-background/70'>
              アクリルという素材を、単なるプラスチック板から「光のオブジェ」へと昇華させること。
              それが、ACRIQUEの使命です。
            </p>

            {/* Keywords */}
            <div className='mt-12 flex flex-wrap gap-4'>
              {['Pure Transparency', 'Sharp Edge', 'Solid Form'].map(
                (keyword) => (
                  <span
                    key={keyword}
                    className='border border-background/20 px-4 py-2 text-xs uppercase tracking-widest text-background/70'
                  >
                    {keyword}
                  </span>
                ),
              )}
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
