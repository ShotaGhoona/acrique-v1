import type { CategoryId } from '@/shared/domain/category/model/types';

export const useCaseImages: Record<CategoryId, Record<string, string>> = {
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
