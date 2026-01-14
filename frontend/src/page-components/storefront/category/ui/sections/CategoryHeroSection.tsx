import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CategoryWithFeatures } from '@/shared/domain/category/model/types';
import { categoryHeroImages } from '../../config/category-hero-images';

interface CategoryHeroSectionProps {
  category: CategoryWithFeatures;
  productCount: number;
}

export function CategoryHeroSection({
  category,
  productCount,
}: CategoryHeroSectionProps) {
  const heroImage =
    categoryHeroImages[category.id] || categoryHeroImages['shop'];

  return (
    <section className='relative min-h-[70vh]'>
      {/* Background Image */}
      <div className='absolute inset-0'>
        <Image
          src={heroImage}
          alt={`${category.name} イメージ`}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-foreground/60' />
      </div>

      {/* Content */}
      <div className='relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 py-24 lg:px-12'>
        <div className='max-w-2xl'>
          {/* Breadcrumb */}
          <nav className='mb-8 flex items-center gap-2 text-xs text-background/50'>
            <Link href='/' className='transition-colors hover:text-background'>
              Home
            </Link>
            <ChevronRight className='h-3 w-3' />
            <span className='text-background/80'>{category.name}</span>
          </nav>

          {/* Label */}
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/50'>
            {category.taglineEn}
          </p>

          {/* Title */}
          <h1 className='mt-6 text-4xl font-light leading-tight text-background md:text-5xl lg:text-6xl'>
            {category.name}
          </h1>

          {/* Tagline */}
          <p className='mt-4 text-2xl font-light italic text-accent md:text-3xl'>
            {category.tagline}
          </p>

          {/* Description */}
          <p className='mt-8 max-w-lg leading-relaxed text-background/70'>
            {category.longDescription}
          </p>

          {/* Stats */}
          <div className='mt-12 flex items-center gap-8 border-t border-background/20 pt-8'>
            <div>
              <div className='text-3xl font-light text-background'>
                {productCount}
              </div>
              <div className='text-xs text-background/50'>Products</div>
            </div>
            <div className='h-8 w-px bg-background/20' />
            <div>
              <div className='text-3xl font-light text-background'>1個〜</div>
              <div className='text-xs text-background/50'>Min Order</div>
            </div>
            <div className='h-8 w-px bg-background/20' />
            <div>
              <div className='text-3xl font-light text-background'>3日〜</div>
              <div className='text-xs text-background/50'>Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className='absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/30 to-transparent' />
    </section>
  );
}
