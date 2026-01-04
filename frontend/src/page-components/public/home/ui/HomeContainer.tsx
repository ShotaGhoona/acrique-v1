import { HeroSection } from '@/widgets/home/ui/HeroSection';
import { BrandStorySection } from '@/widgets/home/ui/BrandStorySection';
import { ProductsShowcaseSection } from '@/widgets/home/ui/ProductsShowcaseSection';
import { FeaturesSection } from '@/widgets/home/ui/FeaturesSection';
import { GallerySection } from '@/widgets/home/ui/GallerySection';
import { CTASection } from '@/widgets/home/ui/CTASection';

export function HomePage() {
  return (
    <>
      {/* Hero: キービジュアル + キャッチコピー */}
      <HeroSection />

      {/* Brand Story: ブランドコンセプト */}
      <BrandStorySection />

      {/* Products: 商品ショーケース */}
      <ProductsShowcaseSection />

      {/* Features: ACRIQUEの強み */}
      <FeaturesSection />

      {/* Gallery: 導入事例 */}
      <GallerySection />

      {/* CTA: お問い合わせ誘導 */}
      <CTASection />
    </>
  );
}
