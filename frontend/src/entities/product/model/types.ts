import type { CategoryId } from '@/shared/domain/category/model/types';

// === 商品画像 ===
export interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
  is_main: boolean;
  sort_order: number;
}

// === 商品オプション値 ===
export interface ProductOptionValue {
  id: number;
  label: string;
  price_diff: number;
  description: string | null;
  sort_order: number;
}

// === 商品オプション ===
export interface ProductOption {
  id: number;
  name: string;
  is_required: boolean;
  sort_order: number;
  values: ProductOptionValue[];
}

// === 商品スペック ===
export interface ProductSpec {
  id: number;
  label: string;
  value: string;
  sort_order: number;
}

// === 商品特長 ===
export interface ProductFeature {
  id: number;
  title: string;
  description: string | null;
  sort_order: number;
}

// === 商品FAQ ===
export interface ProductFaq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

// === 商品一覧アイテム ===
export interface ProductListItem {
  id: string;
  category_id: CategoryId;
  name: string;
  name_ja: string;
  slug: string | null;
  tagline: string | null;
  base_price: number;
  price_note: string | null;
  is_featured: boolean;
  main_image_url: string | null;
  images: ProductImage[];
}

// === 商品詳細 ===
export interface ProductDetail {
  id: string;
  category_id: CategoryId;
  name: string;
  name_ja: string;
  slug: string | null;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  base_price: number;
  price_note: string | null;
  lead_time_days: number | null;
  lead_time_note: string | null;
  requires_upload: boolean;
  upload_type: string | null;
  upload_note: string | null;
  is_featured: boolean;
  images: ProductImage[];
  options: ProductOption[];
  specs: ProductSpec[];
  features: ProductFeature[];
  faqs: ProductFaq[];
  created_at: string | null;
  updated_at: string | null;
}

// === 関連商品 ===
export interface RelatedProduct {
  id: string;
  name: string;
  name_ja: string;
  slug: string | null;
  base_price: number;
  main_image_url: string | null;
}

// === APIレスポンス ===
export interface ProductListResponse {
  products: ProductListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProductSearchResponse {
  products: ProductListItem[];
  total: number;
  keyword: string;
  category_id: string | null;
  limit: number;
  offset: number;
}

export interface ProductOptionsResponse {
  product_id: string;
  options: ProductOption[];
}

export interface ProductRelatedResponse {
  product_id: string;
  related_products: RelatedProduct[];
}

// === APIリクエスト ===
export interface ProductListParams {
  category_id?: CategoryId;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface ProductSearchParams {
  keyword: string;
  category_id?: CategoryId;
  limit?: number;
  offset?: number;
}
