import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type {
  CategoryId,
  CategoryWithFeatures,
  UseCase,
} from '@/shared/domain/category/model/types';

// UseCase画像パスのマッピング
const useCaseImages: Record<CategoryId, Record<string, string>> = {
  shop: {
    'beauty-salon':
      '/IMG/category-page/gallery/41-category-shop-usecase-beauty-salon-v1.png',
    'jewelry-shop':
      '/IMG/category-page/gallery/42-category-shop-usecase-jewelry-shop-v1.png',
    'cafe-restaurant':
      '/IMG/category-page/gallery/43-category-shop-usecase-cafe-restaurant-v1.png',
    boutique:
      '/IMG/category-page/gallery/44-category-shop-usecase-apparel-boutique-v1.png',
  },
  office: {
    startup:
      '/IMG/category-page/gallery/51-category-office-usecase-startup-v1.png',
    'law-firm':
      '/IMG/category-page/gallery/52-category-office-usecase-law-firm-v1.png',
    financial:
      '/IMG/category-page/gallery/53-category-office-usecase-financial-v1.png',
    'design-agency':
      '/IMG/category-page/gallery/54-category-office-usecase-design-agency-v1.png',
  },
  you: {
    'oshi-katsu':
      '/IMG/category-page/gallery/61-category-you-usecase-oshi-katsu-v1.png',
    wedding:
      '/IMG/category-page/gallery/62-category-you-usecase-wedding-v1.png',
    'baby-gift':
      '/IMG/category-page/gallery/63-category-you-usecase-baby-gift-v1.png',
    memorial:
      '/IMG/category-page/gallery/64-category-you-usecase-memorial-v1.png',
  },
};

interface CategoryUseCasesSectionProps {
  category: CategoryWithFeatures;
}

function UseCaseCard({
  useCase,
  index,
  categoryId,
}: {
  useCase: UseCase;
  index: number;
  categoryId: CategoryId;
}) {
  const isLarge = index === 0;
  const imageSrc = useCaseImages[categoryId]?.[useCase.id];

  return (
    <div
      className={`group relative overflow-hidden rounded-sm ${
        isLarge ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Background Image */}
      <div
        className={`relative h-full w-full ${isLarge ? 'aspect-video' : 'aspect-[4/3]'}`}
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={useCase.title}
            fill
            sizes={
              isLarge
                ? '(max-width: 768px) 100vw, 66vw'
                : '(max-width: 768px) 100vw, 33vw'
            }
            className='object-cover'
          />
        )}
      </div>

      {/* Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />

      {/* Content */}
      <div className='absolute bottom-0 left-0 right-0 p-6 text-white md:p-8'>
        {/* Industry Tag */}
        <span className='inline-block rounded-sm bg-white/20 px-2 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm'>
          {useCase.industry}
        </span>

        <h3
          className={`mt-3 font-medium ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}
        >
          {useCase.title}
        </h3>

        <p
          className={`mt-2 text-white/80 ${isLarge ? 'text-base' : 'text-sm'} ${
            isLarge ? '' : 'line-clamp-2'
          }`}
        >
          {useCase.description}
        </p>
      </div>

      {/* Hover Effect */}
      <div className='absolute inset-0 border-2 border-transparent transition-colors group-hover:border-accent' />
    </div>
  );
}

export function CategoryUseCasesSection({
  category,
}: CategoryUseCasesSectionProps) {
  return (
    <section className='bg-secondary/30 py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        {/* Section Header */}
        <div className='mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end'>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
              Use Cases
            </p>
            <h2 className='mt-6 text-3xl font-light md:text-4xl'>
              こんなシーンで活躍
            </h2>
            <p className='mt-4 max-w-lg text-muted-foreground'>
              様々な業種・シーンでご利用いただいています。
              あなたのビジネスにも、ACRIQUEを。
            </p>
          </div>
          <Link
            href='/contact'
            className='inline-flex items-center text-sm font-medium transition-colors hover:text-accent'
          >
            導入のご相談
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </div>

        {/* Use Cases Grid */}
        <div className='grid gap-4 md:grid-cols-3 md:grid-rows-2'>
          {category.useCases.map((useCase, index) => (
            <UseCaseCard
              key={useCase.id}
              useCase={useCase}
              index={index}
              categoryId={category.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
