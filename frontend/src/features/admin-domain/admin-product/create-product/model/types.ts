import type { CategoryId } from '@/shared/domain/category/model/types';
import type { UploadRequirements } from '@/shared/domain/upload/model/types';
import type { ProductionType } from '@/entities/catalog-domain/product/model/types';

/**
 * 商品作成フォームの入力型
 *
 * APIリクエスト（CreateProductRequest）とは異なり、フォーム入力に最適化。
 * - 数値フィールドがstring（inputの値は常にstring）
 * - 空文字を許容（未入力状態の表現）
 */
export interface CreateProductFormData {
  id: string;
  name: string;
  name_ja: string;
  category_id: CategoryId | '';
  tagline: string;
  description: string;
  long_description: string;
  base_price: string;
  price_note: string;
  lead_time_days: string;
  lead_time_note: string;
  is_featured: boolean;
  master_id: string;
  production_type: ProductionType;
  upload_requirements: UploadRequirements;
}

/**
 * CreateProductFormDataの初期値
 */
export const createProductFormDataInitial: CreateProductFormData = {
  id: '',
  name: '',
  name_ja: '',
  category_id: '',
  tagline: '',
  description: '',
  long_description: '',
  base_price: '',
  price_note: '',
  lead_time_days: '',
  lead_time_note: '',
  is_featured: false,
  master_id: '',
  production_type: 'standard',
  upload_requirements: null,
};
