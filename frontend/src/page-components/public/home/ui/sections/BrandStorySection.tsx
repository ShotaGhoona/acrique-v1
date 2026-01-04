import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';

export function BrandStorySection() {
  return (
    <section className='bg-foreground py-32 text-background'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='grid gap-16 lg:grid-cols-2 lg:gap-24'>
          {/* Image */}
          <div className='relative'>
            <ImagePlaceholder
              aspect='3/4'
              variant='dark'
              label='工場・製作風景'
              className='rounded-sm'
            />
            {/* Caption */}
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6'>
              <p className='text-xs uppercase tracking-widest text-white/70'>
                Made in Japan
              </p>
            </div>
          </div>

          {/* Content */}
          <div className='flex flex-col justify-center'>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/50'>
              Brand Story
            </p>

            <h2 className='mt-6 text-3xl font-light leading-tight md:text-4xl'>
              透明な素材を、
              <br />
              重厚なインテリアへ。
            </h2>

            <div className='mt-8 space-y-6 text-base leading-relaxed text-background/70'>
              <p>
                アクリルは、ガラスよりも軽く、割れにくく、
                美しい透明度を持つ素材です。
                しかし、市場に出回る多くのアクリル製品は、
                コストを重視した薄い素材で作られています。
              </p>
              <p>ACRIQUEは違います。</p>
              <p>
                私たちは「厚み」にこだわります。
                1cmの厚みが生み出す重厚感、光の屈折、
                そして手に取った時の確かな存在感。
                それは、大切な空間を彩る「インテリア」として 相応しい品質です。
              </p>
            </div>

            {/* Quote */}
            <blockquote className='mt-12 border-l-2 border-accent pl-6'>
              <p className='text-lg font-light italic text-background/90'>
                &ldquo;透明でありながら、存在感がある。
                <br />
                それがACRIQUEの目指すアクリルです。&rdquo;
              </p>
            </blockquote>

            {/* Values */}
            <div className='mt-12 grid grid-cols-3 gap-8 border-t border-background/10 pt-8'>
              <div>
                <div className='text-xs uppercase tracking-widest text-background/50'>
                  Quality
                </div>
                <div className='mt-2 text-sm text-background/80'>
                  妥協のない品質
                </div>
              </div>
              <div>
                <div className='text-xs uppercase tracking-widest text-background/50'>
                  Craft
                </div>
                <div className='mt-2 text-sm text-background/80'>
                  職人の技術
                </div>
              </div>
              <div>
                <div className='text-xs uppercase tracking-widest text-background/50'>
                  Design
                </div>
                <div className='mt-2 text-sm text-background/80'>
                  洗練された美
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
