import { HeroSection } from './sections/HeroSection';
import { BrandStorySection } from './sections/BrandStorySection';
import { ProductsShowcaseSection } from './sections/ProductsShowcaseSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { GallerySection } from './sections/GallerySection';
import { CTASection } from './sections/CTASection';

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
