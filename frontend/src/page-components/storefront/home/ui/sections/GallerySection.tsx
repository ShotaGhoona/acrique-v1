import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Instagram } from 'lucide-react';
import { SITE_INFO } from '@/shared/config/site-info';

// ギャラリーアイテム（施工事例・使用シーン）
const galleryItems = [
  {
    id: 1,
    label: '美容室 ロゴサイン',
    image:
      '/IMG/home-page/gallery/31-home-gallery-beauty-salon-logo-sign-v1.png',
  },
  {
    id: 2,
    label: 'カフェ メニュー',
    image: '/IMG/home-page/gallery/32-home-gallery-cafe-menu-v1.png',
  },
  {
    id: 3,
    label: 'オフィス 受付',
    image: '/IMG/home-page/gallery/33-home-gallery-office-reception-v1.png',
  },
  {
    id: 4,
    label: 'ジュエリー店 プライスタグ',
    image: '/IMG/home-page/gallery/34-home-gallery-jewelry-price-tag-v1.png',
  },
  {
    id: 5,
    label: '結婚式 ウェルカムボード',
    image:
      '/IMG/home-page/gallery/35-home-gallery-wedding-welcome-board-v1.png',
  },
  {
    id: 6,
    label: 'IT企業 成約記念盾',
    image:
      '/IMG/home-page/gallery/36-home-gallery-it-company-deal-trophy-v1.png',
  },
  {
    id: 7,
    label: 'トレカコレクション',
    image:
      '/IMG/home-page/gallery/37-home-gallery-trading-card-collection-v1.png',
  },
  {
    id: 8,
    label: 'レストラン QRキューブ',
    image: '/IMG/home-page/gallery/38-home-gallery-restaurant-qr-cube-v1.png',
  },
];

export function GallerySection() {
  return (
    <section className='py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Section Header */}
        <div className='mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end'>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
              Gallery
            </p>
            <h2 className='mt-6 text-3xl font-light md:text-4xl'>導入事例</h2>
            <p className='mt-4 max-w-lg text-muted-foreground'>
              様々な業種・シーンでご利用いただいています。
              あなたの空間にも、ACRIQUEを。
            </p>
          </div>
          <Link
            href='/gallery'
            className='inline-flex items-center text-sm font-medium transition-colors hover:text-accent'
          >
            すべての事例を見る
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </div>

        {/* Gallery Grid - Masonry-like */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {galleryItems.map((item, index) => (
            <Link
              key={item.id}
              href='/gallery'
              className={`group relative overflow-hidden rounded-sm ${
                index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className='relative aspect-square h-full w-full'>
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes={
                    index === 0 || index === 5
                      ? '(max-width: 768px) 100vw, 50vw'
                      : '(max-width: 768px) 50vw, 25vw'
                  }
                  className='object-cover transition-transform duration-700 group-hover:scale-105'
                />
              </div>
              {/* Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
              <div className='absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0'>
                <p className='text-sm font-medium text-white'>{item.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className='mt-16 flex items-center justify-center gap-4 border-t border-border pt-16'>
          <Instagram className='h-5 w-5 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>
            最新の施工事例は Instagram でもご覧いただけます
          </p>
          <a
            href={SITE_INFO.social.instagram}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm font-medium transition-colors hover:text-accent'
          >
            {SITE_INFO.social.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
