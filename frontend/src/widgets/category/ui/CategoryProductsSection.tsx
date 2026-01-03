import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';
import type { CategoryWithFeatures } from '@/shared/domain/category/model/types';
// TODO: 後で消す - API接続時にAPIレスポンス型に置換
import type { Product } from '@/shared/dummy-data/products';

interface CategoryProductsSectionProps {
  category: CategoryWithFeatures;
  products: Product[];
}

// 価格のフォーマット
function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}〜`;
}

function ProductCard({
  product,
  categoryId,
}: {
  product: Product;
  categoryId: string;
}) {
  return (
    <Link href={`/${categoryId}/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden rounded-sm bg-secondary/30">
        <ImagePlaceholder
          aspect="4/3"
          variant="light"
          label={product.name}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 rounded-sm bg-background/95 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
          {formatPrice(product.base_price)}
        </div>
      </div>

      {/* Content */}
      <div className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium tracking-wide transition-colors group-hover:text-accent">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.name_ja}</p>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent" />
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.tagline}
        </p>

        {/* Lead Time */}
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground/70">
            <span className="font-medium text-muted-foreground">納期:</span>{' '}
            {product.lead_time_note}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function CategoryProductsSection({
  category,
  products,
}: CategoryProductsSectionProps) {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Products
          </p>
          <h2 className="mt-6 text-3xl font-light md:text-4xl">
            {category.name}のラインナップ
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {category.description}に最適なプロダクトをご用意しています。
            すべて1個からオーダー可能。お気軽にお問い合わせください。
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryId={category.id}
            />
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-20 rounded-sm border border-border bg-secondary/20 p-8 text-center">
          <p className="text-lg font-light">お探しの商品が見つかりませんか？</p>
          <p className="mt-2 text-sm text-muted-foreground">
            カスタムオーダーも承っております。サイズ、形状、デザインなど、
            <br className="hidden md:block" />
            お客様のご要望に合わせた製作が可能です。
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center text-sm font-medium transition-colors hover:text-accent"
          >
            カスタムオーダーについて相談する
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
