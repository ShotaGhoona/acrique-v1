import type { ProductionType } from '@/shared/domain/product/model/types';
import type { UploadRequirements } from '@/shared/domain/upload/model/types';

// === 商品画像 ===
export interface AdminProductImage {
  id: number;
  s3_url: string;
  alt: string | null;
  is_main: boolean;
  sort_order: number;
}

// === 商品オプション値 ===
export interface AdminProductOptionValue {
  id: number | null;
  label: string;
  price_diff: number;
  description: string | null;
  sort_order: number;
}

// === 商品オプション ===
export interface AdminProductOption {
  id: number | null;
  name: string;
  is_required: boolean;
  sort_order: number;
  values: AdminProductOptionValue[];
}

// === 商品スペック ===
export interface AdminProductSpec {
  id: number | null;
  label: string;
  value: string;
  sort_order: number;
}

// === 商品特長 ===
export interface AdminProductFeature {
  id: number | null;
  title: string;
  description: string;
  sort_order: number;
}

// === 商品FAQ ===
export interface AdminProductFaq {
  id: number | null;
  question: string;
  answer: string;
  sort_order: number;
}

// === 管理者用商品（一覧用） ===
export interface AdminProduct {
  id: string;
  name: string;
  name_ja: string | null;
  slug: string;
  tagline: string | null;
  base_price: number;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
  main_image_url: string | null;
}

// === 管理者用商品詳細 ===
export interface AdminProductDetail extends AdminProduct {
  description: string | null;
  long_description: string | null;
  price_note: string | null;
  lead_time_days: number | null;
  lead_time_note: string | null;
  master_id: string | null;
  production_type: ProductionType;
  upload_requirements: UploadRequirements;
  images: AdminProductImage[];
  options: AdminProductOption[];
  specs: AdminProductSpec[];
  features: AdminProductFeature[];
  faqs: AdminProductFaq[];
}

// === 商品一覧取得リクエスト ===
export interface GetAdminProductsRequest {
  search?: string;
  category_id?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

// === 商品一覧取得レスポンス ===
export interface GetAdminProductsResponse {
  products: AdminProduct[];
  total: number;
  limit: number;
  offset: number;
}

// === 商品詳細取得レスポンス ===
export interface GetAdminProductResponse {
  product: AdminProductDetail;
}

// === 商品作成リクエスト ===
export interface CreateProductRequest {
  id: string;
  name: string;
  name_ja: string;
  slug?: string;
  tagline?: string;
  description?: string;
  long_description?: string;
  base_price: number;
  price_note?: string;
  lead_time_days?: number;
  lead_time_note?: string;
  master_id?: string;
  production_type?: ProductionType;
  upload_requirements?: UploadRequirements;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  category_id: string;
}

// === 商品作成レスポンス ===
export interface CreateProductResponse {
  product: AdminProductDetail;
  message: string;
}

// === 商品更新リクエスト ===
export interface UpdateProductRequest {
  name?: string;
  name_ja?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  long_description?: string;
  base_price?: number;
  price_note?: string;
  lead_time_days?: number;
  lead_time_note?: string;
  master_id?: string;
  production_type?: ProductionType;
  upload_requirements?: UploadRequirements;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  category_id?: string;
}

// === 商品更新レスポンス ===
export interface UpdateProductResponse {
  product: AdminProductDetail;
  message: string;
}

// === 商品削除レスポンス ===
export interface DeleteProductResponse {
  message: string;
}

// === Presigned URL取得リクエスト ===
export interface GetPresignedUrlRequest {
  file_name: string;
  content_type: string;
}

// === Presigned URL取得レスポンス ===
export interface GetPresignedUrlResponse {
  upload_url: string;
  file_url: string;
  expires_in: number;
}

// === 画像追加リクエスト ===
export interface AddProductImageRequest {
  s3_url: string;
  alt?: string;
  is_main?: boolean;
  sort_order?: number;
}

// === 画像追加レスポンス ===
export interface AddProductImageResponse {
  image: AdminProductImage;
  message: string;
}

// === 画像更新リクエスト ===
export interface UpdateProductImageRequest {
  alt?: string;
  is_main?: boolean;
  sort_order?: number;
}

// === 画像更新レスポンス ===
export interface UpdateProductImageResponse {
  image: AdminProductImage;
  message: string;
}

// === 画像削除レスポンス ===
export interface DeleteProductImageResponse {
  message: string;
}

// === オプション更新リクエスト ===
export interface UpdateProductOptionsRequest {
  options: AdminProductOption[];
}

// === オプション更新レスポンス ===
export interface UpdateProductOptionsResponse {
  options: AdminProductOption[];
  message: string;
}

// === スペック更新リクエスト ===
export interface UpdateProductSpecsRequest {
  specs: AdminProductSpec[];
}

// === スペック更新レスポンス ===
export interface UpdateProductSpecsResponse {
  specs: AdminProductSpec[];
  message: string;
}

// === 特長更新リクエスト ===
export interface UpdateProductFeaturesRequest {
  features: AdminProductFeature[];
}

// === 特長更新レスポンス ===
export interface UpdateProductFeaturesResponse {
  features: AdminProductFeature[];
  message: string;
}

// === FAQ更新リクエスト ===
export interface UpdateProductFaqsRequest {
  faqs: AdminProductFaq[];
}

// === FAQ更新レスポンス ===
export interface UpdateProductFaqsResponse {
  faqs: AdminProductFaq[];
  message: string;
}
