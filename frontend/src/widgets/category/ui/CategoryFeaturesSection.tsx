import { Check } from 'lucide-react';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';
import type { CategoryWithFeatures } from '@/shared/domain/category/model/types';

interface CategoryFeaturesSectionProps {
  category: CategoryWithFeatures;
}

export function CategoryFeaturesSection({
  category,
}: CategoryFeaturesSectionProps) {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Image */}
          <div className="relative">
            <ImagePlaceholder
              aspect="4/3"
              variant="gradient"
              label="製作工程"
              className="rounded-sm shadow-lg"
            />
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 -z-10 h-2/3 w-2/3 rounded-sm border border-border" />

            {/* Quality Badge */}
            <div className="absolute -right-4 -top-4 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-foreground text-background shadow-xl">
              <span className="text-xs uppercase tracking-wider opacity-70">
                Quality
              </span>
              <span className="text-2xl font-light">A+</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Why Choose Us
            </p>
            <h2 className="mt-6 text-3xl font-light md:text-4xl">
              {category.name}で
              <br />
              選ばれる理由
            </h2>

            <p className="mt-6 leading-relaxed text-muted-foreground">
              ACRIQUEは、{category.description}に特化したプロダクトを
              提供しています。品質、対応力、デザイン、すべてにおいて
              お客様にご満足いただける体制を整えています。
            </p>

            {/* Features List */}
            <ul className="mt-10 space-y-4">
              {category.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div className="text-center">
                <div className="text-2xl font-light">100%</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  国内生産
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light">10年</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  品質保証
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light">24h</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  返信対応
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
