import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';
import type {
  CategoryData,
  UseCase,
} from '@/entities/category/model/category-data';

interface CategoryUseCasesSectionProps {
  category: CategoryData;
}

function UseCaseCard({ useCase, index }: { useCase: UseCase; index: number }) {
  const isLarge = index === 0;

  return (
    <div
      className={`group relative overflow-hidden rounded-sm ${
        isLarge ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Background Image */}
      <ImagePlaceholder
        aspect={isLarge ? '16/9' : '4/3'}
        variant='gradient'
        label={useCase.title}
        className='h-full w-full'
      />

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
            href='/gallery'
            className='inline-flex items-center text-sm font-medium transition-colors hover:text-accent'
          >
            すべての事例を見る
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </div>

        {/* Use Cases Grid */}
        <div className='grid gap-4 md:grid-cols-3 md:grid-rows-2'>
          {category.useCases.map((useCase, index) => (
            <UseCaseCard key={useCase.id} useCase={useCase} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
