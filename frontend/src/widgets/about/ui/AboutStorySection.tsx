import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';

export function AboutStorySection() {
  return (
    <section className='bg-foreground py-32 text-background'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='grid gap-16 lg:grid-cols-2 lg:gap-24'>
          {/* Image */}
          <div className='relative order-2 lg:order-1'>
            <ImagePlaceholder
              aspect='4/5'
              variant='dark'
              label='工場でレーザー加工している様子'
              className='w-full'
            />
            {/* Overlay Badge */}
            <div className='absolute bottom-6 left-6 right-6 bg-black/60 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-widest text-white/70'>
                Factory Direct
              </p>
              <p className='mt-1 text-sm text-white/90'>
                製造工場から直接、世界へ。
              </p>
            </div>
          </div>

          {/* Content */}
          <div className='order-1 flex flex-col justify-center lg:order-2'>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/50'>
              Brand Story
            </p>

            <h2 className='mt-6 text-3xl font-light leading-tight md:text-4xl'>
              工場の技術が生んだ、
              <br />
              クリスタルのような一品。
            </h2>

            <div className='mt-8 space-y-6 text-base leading-relaxed text-background/70'>
              <p>
                ACRIQUEは、長年にわたり精密加工を行ってきた製造工場の技術から生まれました。
              </p>
              <p>
                多くの工業製品が「効率」を求めて角を丸め、薄く作られていく中で、
                私たちは逆の問いを持ちました。
              </p>
              <p className='text-lg font-light text-background/90'>
                「アクリルが持つ本来の美しさを、極限まで引き出したらどうなるだろう？」
              </p>
              <p>
                導き出した答えは、ガラスをも凌ぐ透明度と、
                刃物のように鋭利なカッティング技術の融合でした。
              </p>
            </div>

            {/* Key Points */}
            <div className='mt-12 grid grid-cols-3 gap-8 border-t border-background/10 pt-8'>
              <div>
                <div className='text-2xl font-light'>10mm</div>
                <div className='mt-1 text-xs text-background/50'>
                  厚みへのこだわり
                </div>
              </div>
              <div>
                <div className='text-2xl font-light'>A2</div>
                <div className='mt-1 text-xs text-background/50'>
                  最大加工サイズ
                </div>
              </div>
              <div>
                <div className='text-2xl font-light'>1</div>
                <div className='mt-1 text-xs text-background/50'>
                  個からオーダー可
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
