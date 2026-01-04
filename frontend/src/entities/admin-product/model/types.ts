// === 商品画像 ===
export interface ProductImage {
  id: number;
  product_id: string;
  url: string;
  alt: string | null;
  is_main: boolean;
  sort_order: number;
}

// === 商品オプション値 ===
export interface ProductOptionValue {
  id?: number;
  option_id?: number;
  label: string;
  price_diff: number;
  description?: string | null;
  sort_order: number;
}

// === 商品オプション ===
export interface ProductOption {
  id?: number;
  product_id?: string;
  name: string;
  is_required: boolean;
  sort_order: number;
  values: ProductOptionValue[];
}

// === 商品スペック ===
export interface ProductSpec {
  id?: number;
  product_id?: string;
  label: string;
  value: string;
  sort_order: number;
}

// === 商品特長 ===
export interface ProductFeature {
  id?: number;
  product_id?: string;
  title: string;
  description?: string | null;
  sort_order: number;
}

// === 商品FAQ ===
export interface ProductFaq {
  id?: number;
  product_id?: string;
  question: string;
  answer: string;
  sort_order: number;
}

// === 管理者用商品 ===
export interface AdminProduct {
  id: string;
  category_id: string;
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
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
  images: ProductImage[];
  options: ProductOption[];
  specs: ProductSpec[];
  features: ProductFeature[];
  faqs: ProductFaq[];
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
  product: AdminProduct;
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
  requires_upload?: boolean;
  upload_type?: string;
  upload_note?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  category_id: string;
}

// === 商品作成レスポンス ===
export interface CreateProductResponse {
  product: AdminProduct;
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
  requires_upload?: boolean;
  upload_type?: string;
  upload_note?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  category_id?: string;
}

// === 商品更新レスポンス ===
export interface UpdateProductResponse {
  product: AdminProduct;
  message: string;
}

// === 商品削除レスポンス ===
export interface DeleteProductResponse {
  message: string;
}

// === 画像追加リクエスト ===
export interface AddProductImageRequest {
  url: string;
  alt?: string;
  is_main?: boolean;
  sort_order?: number;
}

// === 画像追加レスポンス ===
export interface AddProductImageResponse {
  image: ProductImage;
  message: string;
}

// === 画像削除レスポンス ===
export interface DeleteProductImageResponse {
  message: string;
}

// === オプション更新リクエスト ===
export interface UpdateProductOptionsRequest {
  options: ProductOption[];
}

// === オプション更新レスポンス ===
export interface UpdateProductOptionsResponse {
  options: ProductOption[];
  message: string;
}

// === スペック更新リクエスト ===
export interface UpdateProductSpecsRequest {
  specs: ProductSpec[];
}

// === スペック更新レスポンス ===
export interface UpdateProductSpecsResponse {
  specs: ProductSpec[];
  message: string;
}

// === 特長更新リクエスト ===
export interface UpdateProductFeaturesRequest {
  features: ProductFeature[];
}

// === 特長更新レスポンス ===
export interface UpdateProductFeaturesResponse {
  features: ProductFeature[];
  message: string;
}

// === FAQ更新リクエスト ===
export interface UpdateProductFaqsRequest {
  faqs: ProductFaq[];
}

// === FAQ更新レスポンス ===
export interface UpdateProductFaqsResponse {
  faqs: ProductFaq[];
  message: string;
}
