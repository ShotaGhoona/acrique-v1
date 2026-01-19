import type { ModelCategory } from '@/shared/domain/product/model/types';

// re-export for convenience
export type { ModelCategory };

// === 管理者用商品マスタ ===
export interface AdminProductMaster {
  id: string;
  name: string;
  name_en: string | null;
  model_category: ModelCategory | null;
  tagline: string | null;
  description: string | null;
  base_lead_time_days: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// === 商品マスタ一覧取得リクエスト ===
export interface GetAdminProductMastersRequest {
  model_category?: ModelCategory;
  is_active?: boolean;
}

// === 商品マスタ一覧取得レスポンス ===
export interface GetAdminProductMastersResponse {
  masters: AdminProductMaster[];
  total: number;
}

// === 商品マスタ作成リクエスト ===
export interface CreateProductMasterRequest {
  id: string;
  name: string;
  name_en?: string;
  model_category?: ModelCategory;
  tagline?: string;
  description?: string;
  base_lead_time_days?: number;
  is_active?: boolean;
  sort_order?: number;
}

// === 商品マスタ作成レスポンス ===
export type CreateProductMasterResponse = AdminProductMaster;

// === 商品マスタ更新リクエスト ===
export interface UpdateProductMasterRequest {
  name?: string;
  name_en?: string;
  model_category?: ModelCategory;
  tagline?: string;
  description?: string;
  base_lead_time_days?: number;
  is_active?: boolean;
  sort_order?: number;
}

// === 商品マスタ更新レスポンス ===
export type UpdateProductMasterResponse = AdminProductMaster;
