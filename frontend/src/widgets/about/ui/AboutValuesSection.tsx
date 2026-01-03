import { Store, Building2, Heart } from 'lucide-react';

const targetValues = [
  {
    icon: Store,
    target: 'For Shop',
    title: 'ブランドを、可視化する。',
    description:
      '店舗の世界観を高めるQRスタンド、メニュー、ディスプレイ。お客様の五感に訴える「透明な重厚感」をお届けします。',
    products: ['QRコードキューブ', 'メニュースタンド', 'ディスプレイライザー'],
  },
  {
    icon: Building2,
    target: 'For Office',
    title: '空間の格を、上げる。',
    description:
      'エントランスサイン、表彰盾、ネームプレート。企業の品格を体現する、妥協のないオフィスプロダクト。',
    products: ['ウォールサイン', 'アワードトロフィー', 'ドアサイン'],
  },
  {
    icon: Heart,
    target: 'For You',
    title: '想いを、永遠に。',
    description:
      '結婚式、出産祝い、推し活。大切な瞬間を透明のなかに閉じ込める、あなただけの一品。',
    products: ['トレカディスプレイ', 'ウェディングボード', 'フォトフレーム'],
  },
];

export function AboutValuesSection() {
  return (
    <section className='bg-secondary/30 py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Header */}
        <div className='text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Our Promise
          </p>
          <h2 className='mt-6 text-3xl font-light md:text-4xl'>
            あなたのシーンに、
            <br />
            透明な価値を。
          </h2>
        </div>

        {/* Values Grid */}
        <div className='mt-20 grid gap-8 lg:grid-cols-3'>
          {targetValues.map((value) => (
            <div
              key={value.target}
              className='group rounded-sm bg-background p-8 transition-shadow hover:shadow-lg'
            >
              {/* Icon & Target */}
              <div className='flex items-center gap-3'>
                <value.icon className='h-5 w-5 text-muted-foreground' />
                <span className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
                  {value.target}
                </span>
              </div>

              {/* Title */}
              <h3 className='mt-6 text-xl font-light'>{value.title}</h3>

              {/* Description */}
              <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
                {value.description}
              </p>

              {/* Products */}
              <div className='mt-6 flex flex-wrap gap-2'>
                {value.products.map((product) => (
                  <span
                    key={product}
                    className='rounded-full bg-secondary px-3 py-1 text-xs'
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quality Promise */}
        <div className='mt-20 rounded-sm bg-foreground p-12 text-center text-background'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/50'>
            Quality Standard
          </p>
          <p className='mt-6 text-2xl font-light md:text-3xl'>
            届いた瞬間に「重い」と感じていただけるはずです。
          </p>
          <p className='mx-auto mt-4 max-w-xl text-background/70'>
            その重みこそが、私たちが保証する品質の証。
            手にした時の確かな存在感をお約束します。
          </p>
        </div>
      </div>
    </section>
  );
}
