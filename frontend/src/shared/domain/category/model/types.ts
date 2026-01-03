/**
 * カテゴリ型定義
 * カテゴリは固定3種類（shop/office/you）のためハードコーディング
 */

export type CategoryId = 'shop' | 'office' | 'you';

export interface Category {
  id: CategoryId;
  name: string;
  nameJa: string;
  tagline: string;
  taglineEn: string;
  description: string;
  longDescription: string;
  href: string;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  industry: string;
}

export interface CategoryFeatures {
  useCases: UseCase[];
  features: string[];
}

export interface CategoryWithFeatures extends Category, CategoryFeatures {}
