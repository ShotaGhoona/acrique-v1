/**
 * カテゴリドメインのバレルエクスポート
 */

// Types
export type {
  CategoryId,
  Category,
  UseCase,
  CategoryWithFeatures,
} from './model/types';

// Data & Helpers
export {
  categories,
  getCategoryById,
  getAllCategories,
  getCategoryIds,
  isValidCategoryId,
} from './data/categories';
