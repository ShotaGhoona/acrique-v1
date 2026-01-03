import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';

// 商品データ（03-items.md + 追加商品）
const products = {
  shop: {
    title: 'For Shop',
    tagline: '世界観を、置く。',
    description: '店舗・サロンの空間を格上げするディスプレイアイテム',
    href: '/shop',
    items: [
      {
        name: 'QR Code Cube',
        nameJa: 'QRコードキューブ',
        href: '/shop/qr-cube',
      },
      {
        name: 'Logo Cutout',
        nameJa: 'ロゴカットアウト',
        href: '/shop/logo-cutout',
      },
      { name: 'Price Tag', nameJa: 'プライスタグ', href: '/shop/price-tag' },
      {
        name: 'Menu Stand',
        nameJa: 'メニュースタンド',
        href: '/shop/menu-stand',
      },
      {
        name: 'Display Riser',
        nameJa: 'ディスプレイライザー',
        href: '/shop/display-riser',
      },
      {
        name: 'Sign Holder',
        nameJa: 'サインホルダー',
        href: '/shop/sign-holder',
      },
    ],
  },
  office: {
    title: 'For Office',
    tagline: '信頼を、刻む。',
    description: '企業の品格を表現するサイン・記念品',
    href: '/office',
    items: [
      {
        name: 'Wall Sign',
        nameJa: 'ウォールサイン',
        href: '/office/wall-sign',
      },
      { name: 'Tombstones', nameJa: '成約記念盾', href: '/office/tombstones' },
      {
        name: 'Name Plate',
        nameJa: 'ネームプレート',
        href: '/office/name-plate',
      },
      {
        name: 'Award Trophy',
        nameJa: 'アワードトロフィー',
        href: '/office/award',
      },
      { name: 'Door Sign', nameJa: 'ドアサイン', href: '/office/door-sign' },
      {
        name: 'Reception Sign',
        nameJa: 'レセプションサイン',
        href: '/office/reception',
      },
    ],
  },
  you: {
    title: 'For You',
    tagline: '瞬間を、閉じ込める。',
    description: '大切な思い出を永遠に残すコレクションアイテム',
    href: '/you',
    items: [
      {
        name: 'Card Display',
        nameJa: 'トレカディスプレイ',
        href: '/you/card-display',
      },
      {
        name: 'Wedding Board',
        nameJa: 'ウェディングボード',
        href: '/you/wedding-board',
      },
      {
        name: 'Baby Memorial',
        nameJa: '手形足形アート',
        href: '/you/baby-print',
      },
      {
        name: 'Photo Frame',
        nameJa: 'フォトフレーム',
        href: '/you/photo-frame',
      },
      {
        name: 'Acrylic Stand',
        nameJa: 'アクリルスタンド',
        href: '/you/acrylic-stand',
      },
      { name: 'Key Block', nameJa: 'キーブロック', href: '/you/key-block' },
    ],
  },
};

function ProductCard({
  name,
  nameJa,
  href,
}: {
  name: string;
  nameJa: string;
  href: string;
}) {
  return (
    <Link href={href} className='group block'>
      <div className='overflow-hidden rounded-sm'>
        <ImagePlaceholder
          aspect='1/1'
          variant='light'
          label={name}
          className='transition-transform duration-500 group-hover:scale-105'
        />
      </div>
      <div className='mt-4'>
        <h4 className='text-sm font-medium tracking-wide transition-colors group-hover:text-accent'>
          {name}
        </h4>
        <p className='mt-1 text-xs text-muted-foreground'>{nameJa}</p>
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  reverse = false,
}: {
  category: (typeof products)[keyof typeof products];
  reverse?: boolean;
}) {
  return (
    <div className='border-t border-border py-20 first:border-t-0 first:pt-0'>
      <div
        className={`grid gap-12 lg:grid-cols-12 lg:gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}
      >
        {/* Category Info */}
        <div
          className={`lg:col-span-3 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <div className='sticky top-24'>
            <p className='text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
              {category.title}
            </p>
            <h3 className='mt-4 text-2xl font-light italic text-accent'>
              {category.tagline}
            </h3>
            <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
              {category.description}
            </p>
            <Link
              href={category.href}
              className='mt-6 inline-flex items-center text-sm font-medium transition-colors hover:text-accent'
            >
              すべて見る
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`lg:col-span-9 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
            {category.items.map((item) => (
              <ProductCard key={item.href} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsShowcaseSection() {
  return (
    <section className='py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Section Header */}
        <div className='mb-20 text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Products
          </p>
          <h2 className='mt-6 text-3xl font-light md:text-4xl'>
            あらゆるシーンに、
            <br className='md:hidden' />
            アクリルの可能性を
          </h2>
          <p className='mx-auto mt-6 max-w-2xl text-muted-foreground'>
            店舗、オフィス、個人のお客様まで。
            用途に合わせた多彩なプロダクトをご用意しています。
          </p>
        </div>

        {/* Categories */}
        <div className='space-y-0'>
          <CategorySection category={products.shop} />
          <CategorySection category={products.office} reverse />
          <CategorySection category={products.you} />
        </div>
      </div>
    </section>
  );
}
