import Link from 'next/link';
import { ArrowRight, Instagram } from 'lucide-react';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';

// ギャラリーアイテム（施工事例・使用シーン）
const galleryItems = [
  { id: 1, aspect: '1/1', label: '美容室 ロゴサイン' },
  { id: 2, aspect: '1/1', label: 'カフェ メニュー' },
  { id: 3, aspect: '1/1', label: 'オフィス 受付' },
  { id: 4, aspect: '1/1', label: 'ジュエリー店 プライスタグ' },
  { id: 5, aspect: '1/1', label: '結婚式 ウェルカムボード' },
  { id: 6, aspect: '1/1', label: 'IT企業 成約記念盾' },
  { id: 7, aspect: '1/1', label: 'トレカコレクション' },
  { id: 8, aspect: '1/1', label: 'レストラン QRキューブ' },
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
              <ImagePlaceholder
                aspect={index === 0 || index === 5 ? '1/1' : '1/1'}
                variant='gradient'
                label={item.label}
                className='h-full w-full transition-transform duration-700 group-hover:scale-105'
              />
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
            href='https://instagram.com/acrique'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm font-medium transition-colors hover:text-accent'
          >
            @acrique
          </a>
        </div>
      </div>
    </section>
  );
}
