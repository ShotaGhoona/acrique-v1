import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';
import type { CategoryWithFeatures } from '@/shared/domain/category/model/types';

interface CategoryHeroSectionProps {
  category: CategoryWithFeatures;
  productCount: number;
}

export function CategoryHeroSection({
  category,
  productCount,
}: CategoryHeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] bg-foreground text-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 py-24 lg:flex-row lg:items-center lg:gap-20 lg:px-12">
        {/* Text Content */}
        <div className="flex-1 lg:max-w-xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-background/50">
            <Link href="/" className="transition-colors hover:text-background">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-background/80">{category.name}</span>
          </nav>

          {/* Label */}
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-background/50">
            {category.taglineEn}
          </p>

          {/* Title */}
          <h1 className="mt-6 text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
            {category.name}
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-2xl font-light italic text-accent md:text-3xl">
            {category.tagline}
          </p>

          {/* Description */}
          <p className="mt-8 max-w-lg leading-relaxed text-background/70">
            {category.longDescription}
          </p>

          {/* Stats */}
          <div className="mt-12 flex items-center gap-8 border-t border-background/10 pt-8">
            <div>
              <div className="text-3xl font-light">{productCount}</div>
              <div className="text-xs text-background/50">Products</div>
            </div>
            <div className="h-8 w-px bg-background/10" />
            <div>
              <div className="text-3xl font-light">1個〜</div>
              <div className="text-xs text-background/50">Min Order</div>
            </div>
            <div className="h-8 w-px bg-background/10" />
            <div>
              <div className="text-3xl font-light">3日〜</div>
              <div className="text-xs text-background/50">Delivery</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12 flex-1 lg:mt-0">
          <div className="relative">
            <ImagePlaceholder
              aspect="4/3"
              variant="dark"
              label={`${category.name} イメージ`}
              className="rounded-sm shadow-2xl"
            />
            {/* Decorative Border */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-sm border border-background/20" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
